"""
Intelligence Celery Tasks - Processamento assíncrono e agendado.

Tasks simples e focadas em valor:
1. Análise automática de documentos
2. Aprendizado com ações de usuários
3. Agregação de padrões (user → org → platform)
4. Geração de alertas proativos

Princípios:
- Cada task faz UMA coisa
- Falhas são logadas, não propagadas
- Retry automático com backoff
- Monitoramento simples com logs
"""
from celery import shared_task
from django.utils import timezone
from django.db.models import Count, Q
import logging
from datetime import timedelta
from uuid import UUID

logger = logging.getLogger('intelligence.tasks')


@shared_task(bind=True, max_retries=3, default_retry_delay=60)
def analyze_document_async(self, document_id: str, document_type: str = 'unknown', organization_id: str = None):
    """
    Analisa documento com IA de forma assíncrona.

    Args:
        document_id: UUID do documento
        document_type: Tipo do documento
        organization_id: UUID da organização
    """
    from ordoc_air.models import Document
    from .services.intelligence_service import IntelligenceService
    from .models import DocumentAnalysis, ProactiveAlert
    import asyncio

    try:
        # Buscar documento
        document = Document.objects.get(id=document_id)

        # Extrair texto (suporta OCR se necessário)
        document_content = _extract_document_text(document)

        if not document_content:
            logger.warning(f"Documento {document_id} sem conteúdo para análise")
            return None

        # Limitar análise a 10.000 caracteres (evita custos excessivos)
        if len(document_content) > 10000:
            document_content = document_content[:10000]
            logger.info(f"Documento {document_id} truncado para análise (>10k chars)")

        # Inicializar serviço e analisar
        service = IntelligenceService()

        # Executar análise (usa asyncio)
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)

        result = loop.run_until_complete(
            service.analyze_document(
                document_id=UUID(document_id),
                document_content=document_content,
                document_type=document_type,
                context={
                    'organization_id': organization_id,
                    'filename': document.name if hasattr(document, 'name') else 'unknown'
                },
                analysis_depth='standard'  # Standard = extraction + classification (não usa LLM Council por padrão)
            )
        )

        loop.close()

        # Salvar resultado
        DocumentAnalysis.objects.update_or_create(
            document_id=document_id,
            defaults={
                'document_type': document_type,
                'extraction_result': result.get('extraction', {}),
                'council_deliberation': result.get('deliberation', {}),
                'analysis_depth': 'standard',
                'processing_time_ms': result.get('processing_time_ms', 0),
                'status': 'completed',
                'completed_at': timezone.now(),
                'organization_id': organization_id
            }
        )

        # Criar alertas E notificações se houver
        from ordoc_cloud.models import Notification, OrdocUser
        
        for alert_data in result.get('alerts', []):
            alert = ProactiveAlert.objects.create(
                document_id=document_id,
                document_type=document_type,
                alert_type=alert_data.get('alert_type', 'suggestion'),
                severity=alert_data.get('severity', 'info'),
                title=alert_data.get('title', 'Alerta'),
                message=alert_data.get('message', ''),
                details=alert_data.get('details', {}),
                suggested_actions=alert_data.get('suggested_actions', []),
                organization_id=organization_id
            )
            
            # Criar notificação para o criador do documento
            if document.created_by:
                try:
                    ordoc_user = OrdocUser.objects.get(user=document.created_by)
                    
                    # Mapear severidade para tipo de notificação
                    notification_type_map = {
                        'critical': 'error',
                        'error': 'error',
                        'warning': 'warning',
                        'info': 'info',
                    }
                    
                    Notification.objects.create(
                        user=ordoc_user,
                        title=alert.title,
                        message=alert.message,
                        notification_type=notification_type_map.get(alert.severity, 'info'),
                        link=f'/documents/{document_id}',
                        metadata={
                            'alert_id': str(alert.id),
                            'document_id': document_id,
                            'document_name': document.name,
                            'severity': alert.severity
                        }
                    )
                    logger.info(f"Notificação criada para usuário {ordoc_user.id} sobre documento {document_id}")
                except OrdocUser.DoesNotExist:
                    logger.warning(f"OrdocUser não encontrado para {document.created_by.username}")

        # Criar notificação automática para documentos críticos ou com dados sensíveis
        if document.criticality in ['high', 'critical'] or document.contains_sensitive_data:
            if document.created_by:
                try:
                    ordoc_user = OrdocUser.objects.get(user=document.created_by)
                    
                    # Mensagem personalizada baseada nas características
                    messages = []
                    if document.contains_sensitive_data:
                        messages.append("contém dados sensíveis (LGPD)")
                    if document.criticality in ['high', 'critical']:
                        messages.append(f"tem criticidade {document.get_criticality_display().lower()}")
                    if document.requires_signature:
                        messages.append("requer assinatura")
                    
                    notification_message = f"O documento '{document.name}' {' e '.join(messages)}. Revise as configurações de segurança e acesso."
                    
                    Notification.objects.create(
                        user=ordoc_user,
                        title=f"📄 Documento {document.get_criticality_display()} Detectado",
                        message=notification_message,
                        notification_type='warning' if document.criticality == 'high' else 'error',
                        link=f'/documents/{document_id}',
                        metadata={
                            'document_id': document_id,
                            'document_name': document.name,
                            'document_type': document.document_type,
                            'criticality': document.criticality,
                            'contains_sensitive_data': document.contains_sensitive_data,
                            'requires_signature': document.requires_signature
                        }
                    )
                    logger.info(f"Notificação de documento crítico criada para {ordoc_user.id}")
                except OrdocUser.DoesNotExist:
                    pass

        logger.info(f"Documento {document_id} analisado com sucesso - {len(result.get('alerts', []))} alertas")
        return result

    except Document.DoesNotExist:
        logger.error(f"Documento {document_id} não encontrado")
        return None
    except Exception as e:
        logger.exception(f"Erro ao analisar documento {document_id}: {e}")
        # Retry com backoff exponencial
        raise self.retry(exc=e, countdown=2 ** self.request.retries * 60)


@shared_task
def notify_document_upload(document_id: str):
    """
    Cria notificação IMEDIATA quando um documento é enviado.
    
    Não espera análise completa - notifica o usuário instantaneamente.
    """
    from ordoc_air.models import Document
    from ordoc_cloud.models import Notification, OrdocUser
    
    try:
        document = Document.objects.select_related('created_by', 'department__organization').get(id=document_id)
        
        if not document.created_by:
            return
        
        try:
            ordoc_user = OrdocUser.objects.get(user=document.created_by)
            
            # Mensagem baseada nas características detectadas
            characteristics = []
            if document.document_type and document.document_type != 'other':
                characteristics.append(f"Tipo: {document.get_document_type_display()}")
            if document.contains_sensitive_data:
                characteristics.append("⚠️ Dados Sensíveis (LGPD)")
            if document.requires_signature:
                characteristics.append("✍️ Requer Assinatura")
            if document.criticality in ['high', 'critical']:
                characteristics.append(f"🔴 Criticidade {document.get_criticality_display()}")
            
            if characteristics:
                message = f"Documento enviado com sucesso. {' | '.join(characteristics)}"
            else:
                message = "Documento enviado com sucesso e está sendo processado."
            
            # Tipo de notificação baseado na criticidade
            notification_type = 'success'
            if document.criticality == 'critical' or document.contains_sensitive_data:
                notification_type = 'warning'
            
            Notification.objects.create(
                user=ordoc_user,
                title=f"📄 {document.name}",
                message=message,
                notification_type=notification_type,
                link=f'/documents/{document_id}',
                metadata={
                    'document_id': document_id,
                    'document_name': document.name,
                    'document_type': document.document_type,
                    'upload_notification': True
                }
            )
            
            logger.info(f"Notificação de upload criada para {ordoc_user.id} - documento {document_id}")
            
        except OrdocUser.DoesNotExist:
            logger.warning(f"OrdocUser não encontrado para {document.created_by.username}")
            
    except Document.DoesNotExist:
        logger.error(f"Documento {document_id} não encontrado para notificação")
    except Exception as e:
        logger.exception(f"Erro ao criar notificação de upload: {e}")


@shared_task
def learn_from_task_action(task_id: str, action_type: str, user_id: str = None, organization_id: str = None):
    """
    Aprende com aprovações/rejeições de tarefas.

    Captura padrões: "Departamento X sempre rejeita tipo Y por motivo Z"
    """
    from ordoc_flow.models import Task
    from .models import KnowledgeFeedback

    try:
        task = Task.objects.select_related('procedure').get(id=task_id)

        # Capturar contexto da ação
        context = {
            'task_id': task_id,
            'procedure_id': str(task.procedure_id) if hasattr(task, 'procedure') else None,
            'procedure_type': task.procedure.template.name if hasattr(task, 'procedure') and hasattr(task.procedure, 'template') else 'unknown',
            'department': task.department.name if hasattr(task, 'department') else None,
            'rejection_reason': task.rejection_reason if hasattr(task, 'rejection_reason') else None
        }

        # Criar feedback
        KnowledgeFeedback.objects.create(
            layer='user',
            document_type='workflow_task',
            action_type=action_type,
            original_value='',  # Não há valor original em tasks
            corrected_value='',
            context=context,
            user_id=user_id,
            organization_id=organization_id,
            sector=task.procedure.sector if hasattr(task, 'procedure') and hasattr(task.procedure, 'sector') else ''
        )

        logger.info(f"Feedback registrado para task {task_id}: {action_type}")

    except Task.DoesNotExist:
        logger.warning(f"Task {task_id} não encontrada para aprendizado")
    except Exception as e:
        logger.error(f"Erro ao aprender com task {task_id}: {e}")


@shared_task
def analyze_signature_pattern(signature_id: str):
    """
    Analisa padrões de assinatura (tempo médio, rejeições, etc).
    """
    from ordoc_sign.models import SignatureRequest
    from .models import KnowledgeFeedback

    try:
        signature = SignatureRequest.objects.get(id=signature_id)

        # Calcular tempo de assinatura
        if signature.created_at and signature.completed_at:
            time_taken = (signature.completed_at - signature.created_at).total_seconds() / 3600  # horas

            # Se demorou muito (>72h), registrar como padrão
            if time_taken > 72:
                KnowledgeFeedback.objects.create(
                    layer='organization',
                    document_type='signature_workflow',
                    action_type='observation',
                    original_value='',
                    corrected_value='',
                    context={
                        'signature_id': signature_id,
                        'time_taken_hours': time_taken,
                        'alert': 'slow_signature'
                    },
                    organization_id=str(signature.workflow.organization_id) if hasattr(signature, 'workflow') else None
                )

        logger.debug(f"Padrão de assinatura analisado: {signature_id}")

    except SignatureRequest.DoesNotExist:
        logger.warning(f"Assinatura {signature_id} não encontrada")
    except Exception as e:
        logger.error(f"Erro ao analisar assinatura {signature_id}: {e}")


@shared_task
def track_document_edit(document_id: str, modified_by: str = None):
    """
    Rastreia edições de documentos como feedback implícito.

    Edições frequentes indicam que algo está errado ou pode ser melhorado.
    """
    from ordoc_air.models import Document
    from .models import KnowledgeFeedback

    try:
        document = Document.objects.get(id=document_id)

        # Contar edições recentes (últimas 24h)
        recent_edits = KnowledgeFeedback.objects.filter(
            context__document_id=document_id,
            action_type='correction',
            created_at__gte=timezone.now() - timedelta(hours=24)
        ).count()

        # Se há muitas edições (>3), pode indicar problema
        if recent_edits >= 3:
            logger.info(f"Documento {document_id} com {recent_edits} edições em 24h - possível problema")

        # Registrar edição
        KnowledgeFeedback.objects.create(
            layer='user',
            document_type=document.document_type or 'unknown',
            action_type='correction',
            original_value='',
            corrected_value='',
            context={
                'document_id': document_id,
                'edit_count': recent_edits + 1
            },
            user_id=modified_by,
            organization_id=str(document.organization_id) if document.organization_id else None
        )

    except Document.DoesNotExist:
        logger.warning(f"Documento {document_id} não encontrado para rastreamento")
    except Exception as e:
        logger.error(f"Erro ao rastrear edição do documento {document_id}: {e}")


@shared_task
def aggregate_patterns_periodic():
    """
    Agrega padrões de user → organization → platform.

    Executa periodicamente (ex: a cada hora) para identificar padrões recorrentes.

    Lógica SIMPLES:
    - Se 3+ usuários fizeram a mesma correção → vira padrão organizacional
    - Se 3+ organizações têm o mesmo padrão → vira padrão de setor
    - Se 3+ setores têm o mesmo padrão → vira padrão de plataforma
    """
    from .models import KnowledgeFeedback, LearnedPattern, PatternFeedbackLink
    from django.db.models import Count

    try:
        # 1. Identificar correções recorrentes (mesma ação, mesmo tipo de doc)
        recurrent_corrections = KnowledgeFeedback.objects.filter(
            processed=False,
            action_type='correction'
        ).values(
            'document_type',
            'corrected_value',
            'organization_id'
        ).annotate(
            count=Count('id')
        ).filter(count__gte=3)  # 3+ ocorrências = padrão

        patterns_created = 0

        for correction in recurrent_corrections:
            # Buscar feedbacks que compõem esse padrão
            feedbacks = KnowledgeFeedback.objects.filter(
                document_type=correction['document_type'],
                corrected_value=correction['corrected_value'],
                organization_id=correction['organization_id'],
                processed=False
            )

            if not feedbacks.exists():
                continue

            # Criar padrão organizacional
            pattern = LearnedPattern.objects.create(
                layer='organization',
                pattern_type='common_correction',
                name=f"Correção recorrente em {correction['document_type']}",
                description=f"Usuários frequentemente corrigem para: {correction['corrected_value'][:100]}",
                condition={
                    'document_type': correction['document_type'],
                    'trigger': 'on_create'
                },
                action={
                    'type': 'suggestion',
                    'message': f"Considere usar: {correction['corrected_value'][:100]}",
                    'auto_applicable': False
                },
                confidence=min(0.9, 0.5 + (feedbacks.count() * 0.1)),  # Mais ocorrências = mais confiança
                occurrences=feedbacks.count(),
                organization_id=correction['organization_id'],
                document_type=correction['document_type']
            )

            # Vincular feedbacks ao padrão
            for feedback in feedbacks:
                PatternFeedbackLink.objects.create(
                    pattern=pattern,
                    feedback=feedback,
                    contribution_weight=1.0 / feedbacks.count()
                )

            # Marcar como processados
            feedbacks.update(processed=True, processed_at=timezone.now())
            patterns_created += 1

        logger.info(f"Agregação periódica concluída: {patterns_created} padrões criados")
        return patterns_created

    except Exception as e:
        logger.exception(f"Erro na agregação periódica de padrões: {e}")
        return 0


@shared_task
def generate_compliance_alerts():
    """
    Gera alertas de compliance automáticos.

    Exemplos:
    - Documentos sem assinatura há 7+ dias
    - Workflows parados há 14+ dias
    - Certificados próximos do vencimento
    """
    from ordoc_air.models import Document
    from ordoc_flow.models import Procedure
    from .models import ProactiveAlert

    alerts_created = 0

    try:
        # 1. Documentos que precisam de assinatura mas não têm
        pending_signature_docs = Document.objects.filter(
            requires_signature=True,
            created_at__lt=timezone.now() - timedelta(days=7)
        ).exclude(
            id__in=Document.objects.filter(
                signatures__isnull=False
            ).values_list('id', flat=True)
        )

        for doc in pending_signature_docs[:50]:  # Limitar a 50 por execução
            alert, created = ProactiveAlert.objects.get_or_create(
                document_id=doc.id,
                alert_type='compliance',
                severity='warning',
                defaults={
                    'title': 'Documento pendente de assinatura',
                    'message': f'Documento "{doc.name}" aguarda assinatura há mais de 7 dias',
                    'details': {'days_pending': (timezone.now() - doc.created_at).days},
                    'suggested_actions': [
                        {
                            'action_type': 'review',
                            'label': 'Enviar para assinatura',
                            'auto_applicable': False
                        }
                    ],
                    'organization_id': doc.organization_id
                }
            )
            if created:
                alerts_created += 1

        # 2. Workflows parados há muito tempo
        stalled_procedures = Procedure.objects.filter(
            status='processing',
            updated_at__lt=timezone.now() - timedelta(days=14)
        )

        for proc in stalled_procedures[:50]:
            alert, created = ProactiveAlert.objects.get_or_create(
                document_id=proc.id,  # Procedure ID como document_id
                document_type='procedure',
                alert_type='compliance',
                severity='error',
                defaults={
                    'title': 'Procedimento parado',
                    'message': f'Procedimento "{proc.title if hasattr(proc, "title") else "Sem título"}" sem atualização há 14+ dias',
                    'details': {'days_stalled': (timezone.now() - proc.updated_at).days},
                    'suggested_actions': [
                        {
                            'action_type': 'review',
                            'label': 'Verificar procedimento',
                            'auto_applicable': False
                        }
                    ],
                    'organization_id': proc.organization_id
                }
            )
            if created:
                alerts_created += 1

        logger.info(f"Alertas de compliance gerados: {alerts_created}")
        return alerts_created

    except Exception as e:
        logger.exception(f"Erro ao gerar alertas de compliance: {e}")
        return 0


@shared_task
def cleanup_expired_alerts():
    """
    Remove alertas expirados ou muito antigos.

    Mantém apenas alertas dos últimos 30 dias.
    """
    from .models import ProactiveAlert

    try:
        cutoff_date = timezone.now() - timedelta(days=30)

        deleted = ProactiveAlert.objects.filter(
            Q(expires_at__lt=timezone.now()) |
            Q(created_at__lt=cutoff_date, user_response__in=['accepted', 'rejected'])
        ).delete()

        logger.info(f"Alertas limpos: {deleted[0]} removidos")
        return deleted[0]

    except Exception as e:
        logger.exception(f"Erro ao limpar alertas expirados: {e}")
        return 0


@shared_task
def analyze_procedure_pattern(procedure_id: str, is_new: bool = False):
    """
    Analisa padrões de procedimentos/workflows.

    Aprende:
    - Tipos mais usados
    - Tempo médio
    - Taxa de aprovação
    """
    from ordoc_flow.models import Procedure
    from .models import KnowledgeFeedback

    try:
        procedure = Procedure.objects.get(id=procedure_id)

        # Registrar padrão de uso
        KnowledgeFeedback.objects.create(
            layer='organization',
            document_type='procedure',
            action_type='observation',
            context={
                'procedure_id': procedure_id,
                'procedure_type': procedure.template.name if hasattr(procedure, 'template') else 'unknown',
                'is_new': is_new,
                'status': procedure.status
            },
            organization_id=procedure.organization_id if hasattr(procedure, 'organization_id') else None
        )

        logger.debug(f"Padrão de procedimento analisado: {procedure_id}")

    except Procedure.DoesNotExist:
        logger.warning(f"Procedimento {procedure_id} não encontrado")
    except Exception as e:
        logger.error(f"Erro ao analisar procedimento {procedure_id}: {e}")


@shared_task
def track_user_activity(user_id: str, activity_type: str, ip_address: str = None, user_agent: str = None):
    """
    Rastreia atividade de usuários (login, logout, etc).

    Detecta:
    - Horários incomuns
    - Frequência de uso
    - Padrões de acesso
    """
    from .models import KnowledgeFeedback
    from django.utils import timezone

    try:
        hour = timezone.now().hour

        # Detectar acesso fora do horário comercial (antes das 7h ou depois das 20h)
        is_unusual_time = hour < 7 or hour > 20

        KnowledgeFeedback.objects.create(
            layer='user',
            document_type='user_activity',
            action_type='observation',
            context={
                'activity_type': activity_type,
                'hour': hour,
                'is_unusual_time': is_unusual_time,
                'ip_address': ip_address,
                'user_agent': user_agent
            },
            user_id=user_id
        )

        if is_unusual_time and activity_type == 'login':
            logger.info(f"Acesso fora do horário detectado: usuário {user_id} às {hour}h")

    except Exception as e:
        logger.error(f"Erro ao rastrear atividade do usuário {user_id}: {e}")


@shared_task
def track_security_event(event_type: str, username: str = None, ip_address: str = None):
    """
    Rastreia eventos de segurança (login_failed, etc).

    Detecta:
    - Tentativas de ataque
    - IPs suspeitos
    """
    from .models import KnowledgeFeedback, ProactiveAlert

    try:
        # Contar falhas recentes deste IP (últimas 24h)
        if ip_address:
            recent_failures = KnowledgeFeedback.objects.filter(
                document_type='security_event',
                context__event_type='login_failed',
                context__ip_address=ip_address,
                created_at__gte=timezone.now() - timedelta(hours=24)
            ).count()

            # Se 5+ falhas, gerar alerta
            if recent_failures >= 5:
                ProactiveAlert.objects.create(
                    document_id=ip_address,  # Usar IP como identificador
                    document_type='security',
                    alert_type='error',
                    severity='critical',
                    title='Possível ataque de força bruta',
                    message=f'IP {ip_address} teve {recent_failures} tentativas de login falhadas em 24h',
                    details={
                        'ip_address': ip_address,
                        'failure_count': recent_failures,
                        'username': username
                    },
                    suggested_actions=[
                        {
                            'action_type': 'block',
                            'label': 'Bloquear IP',
                            'auto_applicable': False
                        }
                    ]
                )

        # Registrar evento
        KnowledgeFeedback.objects.create(
            layer='platform',
            document_type='security_event',
            action_type='observation',
            context={
                'event_type': event_type,
                'username': username,
                'ip_address': ip_address
            }
        )

    except Exception as e:
        logger.error(f"Erro ao rastrear evento de segurança: {e}")


@shared_task
def analyze_organization_usage(organization_id: str):
    """
    Analisa padrões de uso de uma organização.

    Gera insights sobre:
    - Funcionalidades mais usadas
    - Usuários mais ativos
    - Horários de pico
    """
    from .models import KnowledgeFeedback

    try:
        # Análise simples: contar atividades por tipo
        activities = KnowledgeFeedback.objects.filter(
            organization_id=organization_id,
            created_at__gte=timezone.now() - timedelta(days=7)
        ).values('document_type').annotate(count=Count('id'))

        logger.info(f"Uso da organização {organization_id}: {dict(activities)}")

    except Exception as e:
        logger.error(f"Erro ao analisar organização {organization_id}: {e}")


@shared_task
def track_deletion(entity_type: str, entity_id: str, quick_delete: bool = False, organization_id: str = None):
    """
    Rastreia exclusões (documentos, etc).

    Detecta:
    - Exclusões logo após criação (possível erro)
    - Muitas exclusões (problema de UX)
    """
    from .models import KnowledgeFeedback, ProactiveAlert

    try:
        # Se foi exclusão rápida, gerar alerta
        if quick_delete:
            ProactiveAlert.objects.create(
                document_id=entity_id,
                document_type=entity_type,
                alert_type='suggestion',
                severity='info',
                title='Exclusão rápida detectada',
                message=f'{entity_type.capitalize()} foi deletado menos de 5 minutos após criação. Possível erro?',
                details={
                    'entity_type': entity_type,
                    'entity_id': entity_id
                },
                organization_id=organization_id
            )

        # Registrar
        KnowledgeFeedback.objects.create(
            layer='organization' if organization_id else 'platform',
            document_type=f'{entity_type}_deletion',
            action_type='observation',
            context={
                'entity_id': entity_id,
                'quick_delete': quick_delete
            },
            organization_id=organization_id
        )

    except Exception as e:
        logger.error(f"Erro ao rastrear exclusão: {e}")


@shared_task
def track_document_access(document_id: str, user_id: str):
    """
    Rastreia acessos a documentos.

    Detecta:
    - Documentos mais acessados
    - Acesso a docs sensíveis
    - Padrões de uso
    """
    from ordoc_air.models import Document
    from .models import KnowledgeFeedback

    try:
        document = Document.objects.get(id=document_id)

        # Verificar se é documento sensível (nome contém palavras-chave)
        sensitive_keywords = ['confidencial', 'secreto', 'restrito', 'sigiloso']
        is_sensitive = any(kw in document.name.lower() for kw in sensitive_keywords) if hasattr(document, 'name') else False

        if is_sensitive:
             logger.info(f"Acesso a documento sensível {document.id} por {user_id}")

        # Registrar acesso
        KnowledgeFeedback.objects.create(
            layer='user',
            document_type=document.document_type or 'unknown',
            action_type='observation',
            context={
                'document_id': document_id,
                'document_name': document.name,
                'action_label': 'access'
            },
            user_id=user_id,
            organization_id=str(document.organization_id) if document.organization_id else None
        )

    except Document.DoesNotExist:
        logger.warning(f"Documento {document_id} não encontrado para rastreamento de acesso")
    except Exception as e:
        logger.error(f"Erro ao rastrear acesso: {e}")


@shared_task
def track_directory_creation(directory_id: str, user_id: str = None):
    """
    Rastreia criação de diretórios/pastas.
    """
    from ordoc_air.models import Directory
    from .models import KnowledgeFeedback

    try:
        directory = Directory.objects.get(id=directory_id)

        KnowledgeFeedback.objects.create(
            layer='user',
            document_type='directory',
            action_type='approval', # Using 'approval' (positive action) since 'create' isn't in ActionType
            context={
                'action_detail': 'create',
                'folder_id': directory_id,
                'folder_name': directory.name,
                'path': directory.get_full_path(),
                'location': directory.get_full_path()
            },
            user_id=user_id,
            organization_id=str(directory.department.organization_id) if directory.department else None
        )
        
        logger.info(f"Criação de diretório {directory.name} registrada no feed")

    except Directory.DoesNotExist:
        logger.warning(f"Diretório {directory_id} não encontrado para rastreamento")
    except Exception as e:
        logger.error(f"Erro ao rastrear criação de diretório: {e}")


@shared_task
def track_document_download(document_id: str, user_id: str):
    """
    Rastreia downloads de documentos.

    Detecta:
    - Múltiplos downloads do mesmo doc
    - Downloads em massa (possível vazamento)
    """
    from .models import KnowledgeFeedback

    try:
        # Contar downloads recentes deste usuário (última hora)
        recent_downloads = KnowledgeFeedback.objects.filter(
            document_type='document_download',
            user_id=user_id,
            created_at__gte=timezone.now() - timedelta(hours=1)
        ).count()

        # Se 10+ downloads em 1h, alertar
        if recent_downloads >= 10:
            logger.warning(f"Usuário {user_id} baixou {recent_downloads} documentos em 1h - possível vazamento")

        KnowledgeFeedback.objects.create(
            layer='user',
            document_type='document_download',
            action_type='observation',
            context={
                'document_id': document_id,
                'recent_download_count': recent_downloads
            },
            user_id=user_id
        )

    except Exception as e:
        logger.error(f"Erro ao rastrear download: {e}")


@shared_task
def learn_tagging_pattern(document_id: str, action: str):
    """
    Aprende padrões de categorização com tags.

    Detecta:
    - Tags mais usadas por tipo de doc
    - Padrões de organização
    """
    from ordoc_air.models import Document
    from .models import KnowledgeFeedback

    try:
        document = Document.objects.prefetch_related('tags').get(id=document_id)

        tags_list = [tag.name for tag in document.tags.all()] if hasattr(document, 'tags') else []

        KnowledgeFeedback.objects.create(
            layer='organization',
            document_type=document.document_type or 'unknown',
            action_type='observation',
            context={
                'document_id': document_id,
                'tags': tags_list,
                'action': action
            },
            organization_id=str(document.organization_id) if document.organization_id else None
        )

    except Document.DoesNotExist:
        logger.warning(f"Documento {document_id} não encontrado")
    except Exception as e:
        logger.error(f"Erro ao aprender padrão de tags: {e}")


# ========================================
# ANÁLISE PROATIVA PERIÓDICA
# ========================================

@shared_task
def proactive_document_analysis():
    """
    Analisa documentos EXISTENTES periodicamente.

    Não espera upload - vai atrás dos documentos!

    Analisa:
    - Docs sem categoria
    - Docs sem tags
    - Docs duplicados
    - Docs sem metadados
    """
    from ordoc_air.models import Document
    from .models import ProactiveAlert

    try:
        # 1. Documentos sem tipo (categoria)
        uncategorized = Document.objects.filter(
            Q(document_type__isnull=True) | Q(document_type='')
        )[:20]  # Limitar a 20 por execução

        for doc in uncategorized:
            ProactiveAlert.objects.get_or_create(
                document_id=doc.id,
                alert_type='suggestion',
                defaults={
                    'severity': 'info',
                    'title': 'Documento sem categoria',
                    'message': f'Documento "{doc.name}" não tem categoria definida',
                    'details': {'document_id': str(doc.id)},
                    'suggested_actions': [
                        {
                            'action_type': 'categorize',
                            'label': 'Categorizar',
                            'auto_applicable': False
                        }
                    ],
                    'organization_id': doc.organization_id
                }
            )

        # 2. Documentos sem tags
        untagged = Document.objects.annotate(
            tag_count=Count('tags')
        ).filter(tag_count=0)[:20]

        for doc in untagged:
            ProactiveAlert.objects.get_or_create(
                document_id=doc.id,
                alert_type='suggestion',
                defaults={
                    'severity': 'info',
                    'title': 'Documento sem tags',
                    'message': f'Documento "{doc.name}" não possui tags para facilitar busca',
                    'suggested_actions': [
                        {
                            'action_type': 'add_tags',
                            'label': 'Adicionar tags',
                            'auto_applicable': False
                        }
                    ],
                    'organization_id': doc.organization_id
                }
            )

        logger.info(f"Análise proativa: {uncategorized.count()} sem categoria, {untagged.count()} sem tags")

    except Exception as e:
        logger.exception(f"Erro na análise proativa de documentos: {e}")


@shared_task
def generate_insights_report():
    """
    Gera relatório de insights automaticamente.

    Analisa últimos 7 dias e gera insights sobre:
    - Padrões de uso
    - Gargalos
    - Oportunidades de melhoria
    """
    from .models import KnowledgeFeedback, ProactiveAlert
    from django.db.models import Count

    try:
        cutoff = timezone.now() - timedelta(days=7)

        # Top 5 atividades mais comuns
        top_activities = KnowledgeFeedback.objects.filter(
            created_at__gte=cutoff
        ).values('document_type').annotate(
            count=Count('id')
        ).order_by('-count')[:5]

        # Gerar alerta com insights
        insights_text = "Insights dos últimos 7 dias:\n"
        for activity in top_activities:
            insights_text += f"- {activity['document_type']}: {activity['count']} ocorrências\n"

        ProactiveAlert.objects.create(
            document_id='insights-report',
            document_type='analytics',
            alert_type='suggestion',
            severity='info',
            title='Relatório Semanal de Insights',
            message=insights_text,
            details={'period': '7_days', 'activities': list(top_activities)}
        )

        logger.info(f"Relatório de insights gerado: {len(top_activities)} atividades")

    except Exception as e:
        logger.exception(f"Erro ao gerar relatório de insights: {e}")


@shared_task
def analyze_directories_health():
    """
    Analisa saúde de pastas periodicamente (Feature 1.2).

    Detecta e gera alertas para:
    - Pastas com muitos documentos sem categoria (>20)
    - Pastas muito grandes que precisam ser subdivididas (>150 docs)
    - Pastas com documentos antigos sem revisão (>1 ano)

    Execução: A cada 6 horas (configurado no Celery Beat)
    """
    from ordoc_air.models import Directory, Document, Organization
    from .models import ProactiveAlert
    from django.db.models import Count, Q

    try:
        total_alerts = 0

        # Iterar por todas as organizações ativas
        for org in Organization.objects.filter(is_active=True):
            # Buscar todas as pastas da organização (via department)
            directories = Directory.objects.filter(
                department__organization=org,
                is_active=True
            )

            for directory in directories:
                # Contar documentos na pasta (documentos não deletados)
                docs = Document.objects.filter(
                    directory=directory,
                    deleted_at__isnull=True
                )
                total_docs = docs.count()

                # Se pasta vazia, pular
                if total_docs == 0:
                    continue

                # 1. Detectar documentos sem tags (não categorizados)
                uncategorized_count = docs.filter(tags__isnull=True).count()

                if uncategorized_count > 20:
                    ProactiveAlert.objects.get_or_create(
                        document_id=f"dir-{directory.id}-uncategorized",
                        organization_id=org.id,
                        defaults={
                            'document_type': 'directory',
                            'alert_type': 'warning',
                            'severity': 'warning',
                            'title': f'Pasta "{directory.name}" precisa de organização',
                            'message': f'Esta pasta contém {uncategorized_count} documentos sem tags de um total de {total_docs} documentos.',
                            'details': {
                                'directory_id': str(directory.id),
                                'directory_name': directory.name,
                                'uncategorized_count': uncategorized_count,
                                'total_documents': total_docs
                            },
                            'suggested_actions': [
                                {
                                    'action_type': 'categorize',
                                    'label': 'Categorizar documentos',
                                    'auto_applicable': False
                                }
                            ]
                        }
                    )
                    total_alerts += 1

                # 2. Detectar pastas muito grandes (>150 docs)
                if total_docs > 150:
                    ProactiveAlert.objects.get_or_create(
                        document_id=f"dir-{directory.id}-toolarge",
                        organization_id=org.id,
                        defaults={
                            'document_type': 'directory',
                            'alert_type': 'suggestion',
                            'severity': 'info',
                            'title': f'Pasta "{directory.name}" pode ser subdividida',
                            'message': f'Esta pasta contém {total_docs} documentos. Considere criar subpastas para melhor organização.',
                            'details': {
                                'directory_id': str(directory.id),
                                'directory_name': directory.name,
                                'total_documents': total_docs
                            },
                            'suggested_actions': [
                                {
                                    'action_type': 'organize',
                                    'label': 'Criar subpastas',
                                    'auto_applicable': False
                                }
                            ]
                        }
                    )
                    total_alerts += 1

                # 3. Detectar documentos antigos sem revisão (>1 ano)
                one_year_ago = timezone.now() - timedelta(days=365)
                old_docs_count = docs.filter(
                    created_at__lt=one_year_ago
                ).count()

                if old_docs_count > 30:  # Alerta apenas se tiver muitos docs antigos
                    ProactiveAlert.objects.get_or_create(
                        document_id=f"dir-{directory.id}-oldocs",
                        organization_id=org.id,
                        defaults={
                            'document_type': 'directory',
                            'alert_type': 'info',
                            'severity': 'info',
                            'title': f'Pasta "{directory.name}" contém documentos antigos',
                            'message': f'Esta pasta possui {old_docs_count} documentos com mais de 1 ano. Considere revisar ou arquivar.',
                            'details': {
                                'directory_id': str(directory.id),
                                'directory_name': directory.name,
                                'old_documents_count': old_docs_count,
                                'total_documents': total_docs
                            },
                            'suggested_actions': [
                                {
                                    'action_type': 'review',
                                    'label': 'Revisar documentos antigos',
                                    'auto_applicable': False
                                }
                            ]
                        }
                    )
                    total_alerts += 1

        logger.info(f"Análise de saúde de pastas concluída: {total_alerts} alertas gerados/atualizados")

    except Exception as e:
        logger.exception(f"Erro na análise de saúde de pastas: {e}")


# Helper functions
def _extract_document_text(document) -> str:
    """
    Extrai texto de um documento.

    Suporta:
    - Texto direto (se já extraído por OCR)
    - Campos de metadados
    """
    # Se tem campo 'content' ou 'extracted_text'
    if hasattr(document, 'extracted_text') and document.extracted_text:
        return document.extracted_text

    if hasattr(document, 'content') and document.content:
        return document.content

    # Fallback: usar nome + descrição
    parts = []
    if hasattr(document, 'name'):
        parts.append(f"Arquivo: {document.name}")
    if hasattr(document, 'description') and document.description:
        parts.append(f"Descrição: {document.description}")

    return '\n'.join(parts) if parts else ''


@shared_task
def analyze_audit_patterns():
    """
    Analisa padrões nos logs de auditoria (ActivityLog) para detectar insights.
    
    Detecta:
    - Horários de pico de atividade
    - Usuários mais ativos
    - Tipos de ações mais comuns
    - Documentos com muitas modificações (possivel trabalho em andamento)
    - Padrões suspeitos (muitas exclusões, downloads em massa)
    
    Execução: A cada 24 horas (configurado no Celery Beat)
    """
    from ordoc_air.models import ActivityLog, Organization
    from django.db.models import Count, Q
    from collections import Counter
    from datetime import datetime
    
    try:
        # Analisar últimos 7 dias
        cutoff = timezone.now() - timedelta(days=7)
        
        # Iterar por organizações ativas
        for org in Organization.objects.filter(is_active=True):
            logs = ActivityLog.objects.filter(
                organization=org,
                created_at__gte=cutoff
            )
            
            total_activities = logs.count()
            
            if total_activities == 0:
                continue
            
            # 1. Detectar horários de pico (agrupar por hora do dia)
            hour_distribution = Counter()
            for log in logs:
                hour = log.created_at.hour
                hour_distribution[hour] += 1
            
            # Encontrar hora de pico
            if hour_distribution:
                peak_hour = max(hour_distribution, key=hour_distribution.get)
                peak_count = hour_distribution[peak_hour]
                peak_percentage = (peak_count / total_activities) * 100
            
            # 2. Detectar usuários mais ativos
            top_users = logs.values('user__username', 'user__first_name', 'user__last_name').annotate(
                activity_count=Count('id')
            ).order_by('-activity_count')[:5]
            
            # 3. Detectar ações mais comuns
            top_actions = logs.values('action').annotate(
                count=Count('id')
            ).order_by('-count')[:5]
            
            # 4. Detectar documentos com muitas modificações (trabalho em andamento)
            hot_documents = logs.filter(
                entity_type='document',
                action__in=['update', 'version']
            ).values('entity_id', 'entity_name').annotate(
                modification_count=Count('id')
            ).filter(modification_count__gte=10).order_by('-modification_count')[:5]
            
            # 5. Detectar padrões suspeitos
            suspicious_patterns = []
            
            # Muitas exclusões (>20 em 7 dias)
            delete_count = logs.filter(action='delete').count()
            if delete_count > 20:
                suspicious_patterns.append({
                    'pattern': 'high_deletion_rate',
                    'message': f'{delete_count} documentos excluídos nos últimos 7 dias',
                    'severity': 'warning'
                })
            
            # Downloads em massa por um único usuário (>50 em 7 dias)
            download_by_user = logs.filter(action='download').values('user__username').annotate(
                download_count=Count('id')
            ).filter(download_count__gt=50)
            
            if download_by_user.exists():
                for user_data in download_by_user:
                    suspicious_patterns.append({
                        'pattern': 'mass_download',
                        'message': f'Usuário {user_data["user__username"]} fez {user_data["download_count"]} downloads',
                        'severity': 'warning'
                    })
            
            # Armazenar insights no cache ou banco (usando um modelo auxiliar se necessário)
            logger.info(
                f"[Org: {org.corporate_name}] Análise de auditoria concluída: "
                f"{total_activities} atividades, "
                f"pico às {peak_hour}h ({peak_percentage:.1f}%), "
                f"{len(hot_documents)} docs em trabalho intenso, "
                f"{len(suspicious_patterns)} padrões suspeitos"
            )
            
            # Retornar insights (podem ser salvos em cache ou modelo)
            insights = {
                'organization_id': str(org.id),
                'period': '7_days',
                'total_activities': total_activities,
                'peak_hour': peak_hour if hour_distribution else None,
                'peak_percentage': peak_percentage if hour_distribution else 0,
                'top_users': list(top_users),
                'top_actions': list(top_actions),
                'hot_documents': list(hot_documents),
                'suspicious_patterns': suspicious_patterns,
                'analyzed_at': timezone.now().isoformat()
            }
            
            # Salvar insights em cache do Django (expira em 24h)
            from django.core.cache import cache
            cache.set(f'audit_insights_{org.id}', insights, 60 * 60 * 24)
        
        logger.info("Análise de padrões de auditoria concluída para todas as organizações")
        
    except Exception as e:
        logger.exception(f"Erro na análise de padrões de auditoria: {e}")


@shared_task
def recalculate_behavior_scores():
    """
    Recalcula os scores de comportamento para todos os usuários ativos.
    Executado periodicamente via Celery Beat (Horário).
    """
    from django.contrib.auth import get_user_model
    from .services.ranking_service import RankingService
    
    User = get_user_model()
    service = RankingService()
    
    # Processar apenas usuários ativos (limitados para evitar overhead excessivo)
    # Em produção, pode ser paginado ou processado por organização
    active_users = User.objects.filter(is_active=True).order_by('-last_login')[:1000]
    
    success_count = 0
    error_count = 0
    
    for user in active_users:
        try:
            service.calculate_user_scores(user)
            success_count += 1
        except Exception as e:
            logger.error(f"Erro ao calcular scores para {user.username}: {e}")
            error_count += 1
            
    logger.info(f"Recálculo de scores concluído: {success_count} sucessos, {error_count} falhas")
    return {"success": success_count, "errors": error_count}


@shared_task
def track_document_share(document_id: str, user_id: str, shared_with: str = None):
    """
    Rastreia compartilhamentos de documentos.
    """
    from ordoc_air.models import Document
    from .models import KnowledgeFeedback
    
    try:
        document = Document.objects.get(id=document_id)
        
        KnowledgeFeedback.objects.create(
            layer='user',
            document_type=document.document_type or 'unknown',
            action_type='approval',
            context={
                'action_detail': 'share',
                'document_id': document_id,
                'document_name': document.name,
                'shared_with': shared_with,
                'location': 'Meu Drive'
            },
            user_id=user_id,
            organization_id=str(document.organization_id) if document.organization_id else None
        )
        
        logger.info(f"Compartilhamento rastreado: Doc {document_id} por User {user_id}")
        
    except Document.DoesNotExist:
        logger.warning(f"Documento {document_id} não encontrado para rastreamento de share")
    except Exception as e:
        logger.error(f"Erro ao rastrear share: {e}")


@shared_task
def track_document_creation(document_id: str, user_id: str):
    """
    Registra a criação de um documento no feed de atividades.
    """
    from ordoc_air.models import Document
    from .models import KnowledgeFeedback
    
    try:
        document = Document.objects.get(id=document_id)
        
        KnowledgeFeedback.objects.create(
            layer='user',
            document_type=document.document_type or 'unknown',
            action_type='approval', # Proxy para 'creation' (ação positiva)
            context={
                'action_detail': 'create',
                'document_id': document_id,
                'document_name': document.name,
                'location': 'Meu Drive' # TODO: Pegar do directory
            },
            user_id=user_id,
            organization_id=str(document.organization_id) if document.organization_id else None
        )
    except Exception as e:
        logger.error(f"Erro ao rastrear criação doc {document_id}: {e}")


@shared_task
def track_signature_event(signature_id: str, event_type: str):
    """
    Registra eventos de assinatura (solicitado, assinado).
    """
    from ordoc_sign.models import SignatureRequest
    from .models import KnowledgeFeedback
    
    try:
        sig = SignatureRequest.objects.get(id=signature_id)
        
        action_detail = 'sign_completed' if event_type == 'completed' else 'sign_requested'
        
        KnowledgeFeedback.objects.create(
            layer='user',
            document_type='signature',
            action_type='approval',
            context={
                'action_detail': action_detail,
                'document_id': str(sig.document_id) if sig.document else None,
                'document_name': sig.document.name if sig.document else 'Documento',
                'signer_name': sig.signer_name or sig.signer_email
            },
            # Se tiver usuário associado ao signer
            user_id=str(sig.signer_user.id) if sig.signer_user else None,
            organization_id=str(sig.workflow.organization_id) if hasattr(sig, 'workflow') else None
        )
    except Exception as e:
        logger.error(f"Erro ao rastrear assinatura {signature_id}: {e}")
