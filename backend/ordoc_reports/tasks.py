from celery import shared_task
from django.utils import timezone
from datetime import timedelta
import logging

logger = logging.getLogger(__name__)


@shared_task(bind=True, max_retries=3)
def generate_report_task(self, report_id):
    """
    Task assíncrona para geração de relatórios
    """
    try:
        from .models import Report
        from .services import ReportGenerationService
        
        # Busca o relatório
        try:
            report = Report.objects.get(id=report_id)
        except Report.DoesNotExist:
            logger.error(f"Relatório {report_id} não encontrado")
            return
        
        logger.info(f"Iniciando geração do relatório {report_id}: {report.title}")
        
        # Gera o relatório
        ReportGenerationService.generate_report(report)
        
        logger.info(f"Relatório {report_id} gerado com sucesso")
        
        # Envia notificação se configurado
        # TODO: Implementar sistema de notificações
        
        return f"Relatório {report_id} gerado com sucesso"
    
    except Exception as exc:
        logger.error(f"Erro ao gerar relatório {report_id}: {str(exc)}")
        
        # Retry com backoff exponencial
        try:
            raise self.retry(exc=exc, countdown=60 * (2 ** self.request.retries))
        except self.MaxRetriesExceededError:
            # Marca relatório como falhou após esgotar tentativas
            try:
                from .models import Report
                report = Report.objects.get(id=report_id)
                report.status = 'failed'
                report.error_message = f"Falha após {self.request.retries} tentativas: {str(exc)}"
                report.save()
            except:
                pass
            
            logger.error(f"Relatório {report_id} falhou após {self.request.retries} tentativas")
            return f"Relatório {report_id} falhou após esgotar tentativas"


@shared_task
def process_scheduled_reports_task():
    """
    Task para processar relatórios agendados
    Deve ser executada periodicamente (ex: a cada 15 minutos)
    """
    try:
        from .services import ReportScheduleService
        
        logger.info("Iniciando processamento de relatórios agendados")
        
        ReportScheduleService.process_scheduled_reports()
        
        logger.info("Processamento de relatórios agendados concluído")
        
        return "Relatórios agendados processados com sucesso"
    
    except Exception as exc:
        logger.error(f"Erro ao processar relatórios agendados: {str(exc)}")
        return f"Erro ao processar relatórios agendados: {str(exc)}"


@shared_task
def cleanup_expired_reports_task():
    """
    Task para limpeza de relatórios expirados
    Deve ser executada diariamente
    """
    try:
        from .services import ReportCleanupService
        
        logger.info("Iniciando limpeza de relatórios expirados")
        
        cleaned_count = ReportCleanupService.cleanup_expired_reports()
        
        logger.info(f"Limpeza de relatórios expirados concluída: {cleaned_count} relatórios limpos")
        
        return f"Limpeza concluída: {cleaned_count} relatórios expirados removidos"
    
    except Exception as exc:
        logger.error(f"Erro na limpeza de relatórios expirados: {str(exc)}")
        return f"Erro na limpeza: {str(exc)}"


@shared_task
def cleanup_old_reports_task(days=90):
    """
    Task para limpeza de relatórios muito antigos
    Deve ser executada semanalmente
    """
    try:
        from .services import ReportCleanupService
        
        logger.info(f"Iniciando limpeza de relatórios antigos (>{days} dias)")
        
        cleaned_count = ReportCleanupService.cleanup_old_reports(days)
        
        logger.info(f"Limpeza de relatórios antigos concluída: {cleaned_count} relatórios removidos")
        
        return f"Limpeza concluída: {cleaned_count} relatórios antigos removidos"
    
    except Exception as exc:
        logger.error(f"Erro na limpeza de relatórios antigos: {str(exc)}")
        return f"Erro na limpeza: {str(exc)}"


@shared_task
def export_reports_task(report_ids, export_format='zip', include_metadata=True):
    """
    Task assíncrona para exportação em lote de relatórios
    """
    try:
        from .services import ReportExportService
        
        logger.info(f"Iniciando exportação de {len(report_ids)} relatórios")
        
        export_path = ReportExportService.export_reports(
            report_ids=report_ids,
            export_format=export_format,
            include_metadata=include_metadata
        )
        
        logger.info(f"Exportação concluída: {export_path}")
        
        return {
            'success': True,
            'export_path': export_path,
            'report_count': len(report_ids)
        }
    
    except Exception as exc:
        logger.error(f"Erro na exportação de relatórios: {str(exc)}")
        return {
            'success': False,
            'error': str(exc)
        }


@shared_task
def calculate_report_metrics_task():
    """
    Task para calcular métricas agregadas de relatórios
    Deve ser executada diariamente
    """
    try:
        from .models import Report, ReportTemplate, ReportMetric
        from django.db.models import Count, Avg, Sum
        
        logger.info("Iniciando cálculo de métricas de relatórios")
        
        now = timezone.now()
        yesterday = now - timedelta(days=1)
        
        # Métricas por organização
        from ordoc_air.models import Organization
        
        for organization in Organization.objects.all():
            # Total de relatórios gerados ontem
            reports_yesterday = Report.objects.filter(
                organization=organization,
                created_at__date=yesterday.date()
            ).count()
            
            if reports_yesterday > 0:
                ReportMetric.objects.create(
                    metric_type='generation_count',
                    metric_name='Relatórios gerados por dia',
                    metric_value=reports_yesterday,
                    metric_unit='count',
                    period_start=yesterday.replace(hour=0, minute=0, second=0, microsecond=0),
                    period_end=yesterday.replace(hour=23, minute=59, second=59, microsecond=999999),
                    organization=organization
                )
            
            # Tempo médio de geração ontem
            avg_time = Report.objects.filter(
                organization=organization,
                created_at__date=yesterday.date(),
                generation_time__isnull=False
            ).aggregate(avg=Avg('generation_time'))['avg']
            
            if avg_time:
                ReportMetric.objects.create(
                    metric_type='generation_time',
                    metric_name='Tempo médio de geração por dia',
                    metric_value=avg_time.total_seconds(),
                    metric_unit='seconds',
                    period_start=yesterday.replace(hour=0, minute=0, second=0, microsecond=0),
                    period_end=yesterday.replace(hour=23, minute=59, second=59, microsecond=999999),
                    organization=organization
                )
            
            # Taxa de erro ontem
            total_reports = Report.objects.filter(
                organization=organization,
                created_at__date=yesterday.date()
            ).count()
            
            failed_reports = Report.objects.filter(
                organization=organization,
                created_at__date=yesterday.date(),
                status='failed'
            ).count()
            
            if total_reports > 0:
                error_rate = (failed_reports / total_reports) * 100
                
                ReportMetric.objects.create(
                    metric_type='error_rate',
                    metric_name='Taxa de erro por dia',
                    metric_value=error_rate,
                    metric_unit='percentage',
                    period_start=yesterday.replace(hour=0, minute=0, second=0, microsecond=0),
                    period_end=yesterday.replace(hour=23, minute=59, second=59, microsecond=999999),
                    organization=organization
                )
        
        logger.info("Cálculo de métricas de relatórios concluído")
        
        return "Métricas calculadas com sucesso"
    
    except Exception as exc:
        logger.error(f"Erro no cálculo de métricas: {str(exc)}")
        return f"Erro no cálculo de métricas: {str(exc)}"


@shared_task
def send_report_notification_task(report_id, notification_type='completion'):
    """
    Task para envio de notificações sobre relatórios
    """
    try:
        from .models import Report
        
        # Busca o relatório
        try:
            report = Report.objects.get(id=report_id)
        except Report.DoesNotExist:
            logger.error(f"Relatório {report_id} não encontrado para notificação")
            return
        
        logger.info(f"Enviando notificação de {notification_type} para relatório {report_id}")
        
        # TODO: Implementar envio real de notificações
        # Por enquanto, apenas log
        
        if notification_type == 'completion':
            message = f"Relatório '{report.title}' foi gerado com sucesso"
        elif notification_type == 'error':
            message = f"Erro na geração do relatório '{report.title}': {report.error_message}"
        else:
            message = f"Notificação sobre relatório '{report.title}'"
        
        # Simula envio de notificação
        logger.info(f"NOTIFICAÇÃO: {message}")
        
        # TODO: Implementar envio real
        # - Email
        # - Push notification
        # - Webhook
        # - Slack/Teams
        
        return f"Notificação enviada para relatório {report_id}"
    
    except Exception as exc:
        logger.error(f"Erro ao enviar notificação para relatório {report_id}: {str(exc)}")
        return f"Erro ao enviar notificação: {str(exc)}"


@shared_task
def validate_report_templates_task():
    """
    Task para validar templates de relatórios
    Verifica se as configurações estão válidas
    """
    try:
        from .models import ReportTemplate
        
        logger.info("Iniciando validação de templates de relatórios")
        
        invalid_templates = []
        
        for template in ReportTemplate.objects.filter(status='active'):
            try:
                # Valida configuração da consulta
                query_config = template.query_config
                
                if not query_config.get('model'):
                    invalid_templates.append((template.id, "Modelo não especificado"))
                    continue
                
                if not query_config.get('fields'):
                    invalid_templates.append((template.id, "Campos não especificados"))
                    continue
                
                # Tenta executar uma consulta de teste
                from .services import ReportGenerationService
                
                try:
                    ReportGenerationService._execute_query(
                        query_config,
                        {},
                        template.organization,
                        limit=1
                    )
                except Exception as e:
                    invalid_templates.append((template.id, f"Erro na consulta: {str(e)}"))
            
            except Exception as e:
                invalid_templates.append((template.id, f"Erro geral: {str(e)}"))
        
        if invalid_templates:
            logger.warning(f"Templates inválidos encontrados: {len(invalid_templates)}")
            for template_id, error in invalid_templates:
                logger.warning(f"Template {template_id}: {error}")
        else:
            logger.info("Todos os templates estão válidos")
        
        return {
            'total_templates': ReportTemplate.objects.filter(status='active').count(),
            'invalid_templates': len(invalid_templates),
            'errors': invalid_templates
        }
    
    except Exception as exc:
        logger.error(f"Erro na validação de templates: {str(exc)}")
        return f"Erro na validação: {str(exc)}"
