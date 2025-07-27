from celery import shared_task
from django.utils import timezone
from django.conf import settings
from django.core.mail import send_mail
from django.template.loader import render_to_string
from datetime import timedelta
import logging

from .models import (
    DigitalCertificate, SignatureRequest, SignatureRequestSigner,
    DocumentSignature, SignatureAuditLog, SignatureBatch
)
from .services import (
    CertificateService, SignatureService, SignatureBatchService,
    SignatureReportService
)

logger = logging.getLogger(__name__)


@shared_task(bind=True, max_retries=3)
def send_signature_notification(self, signer_id):
    """
    Envia notificação de assinatura para um assinante
    """
    try:
        signer = SignatureRequestSigner.objects.get(id=signer_id)
        signature_request = signer.signature_request
        
        # Preparar contexto do email
        context = {
            'signer': signer,
            'signature_request': signature_request,
            'document': signature_request.document,
            'organization': signature_request.organization,
            'access_url': f"{getattr(settings, 'FRONTEND_URL', '')}/sign/{signer.access_token}",
            'expires_at': signature_request.expires_at,
        }
        
        # Renderizar template de email
        subject = f"Solicitação de Assinatura: {signature_request.title}"
        html_message = render_to_string('ordoc_sign/signature_notification.html', context)
        text_message = render_to_string('ordoc_sign/signature_notification.txt', context)
        
        # Enviar email
        send_mail(
            subject=subject,
            message=text_message,
            html_message=html_message,
            from_email=getattr(settings, 'DEFAULT_FROM_EMAIL', 'noreply@ordoc.ai'),
            recipient_list=[signer.email],
            fail_silently=False
        )
        
        # Atualizar status do assinante
        signer.notify()
        signer.save()
        
        # Log de auditoria
        SignatureAuditLog.objects.create(
            organization=signature_request.organization,
            signature_request=signature_request,
            action='signer_notified',
            description=f'Assinante notificado: {signer.email}',
            user_email='system@ordoc.ai',
            user_name='Sistema'
        )
        
        logger.info(f"Notificação enviada para {signer.email} - Solicitação {signature_request.id}")
        return f"Notificação enviada com sucesso para {signer.email}"
        
    except SignatureRequestSigner.DoesNotExist:
        logger.error(f"Assinante {signer_id} não encontrado")
        return f"Assinante {signer_id} não encontrado"
    
    except Exception as e:
        logger.error(f"Erro ao enviar notificação para assinante {signer_id}: {str(e)}")
        # Retry com backoff exponencial
        raise self.retry(countdown=60 * (2 ** self.request.retries), exc=e)


@shared_task(bind=True, max_retries=3)
def send_signature_reminder(self, signer_id):
    """
    Envia lembrete de assinatura pendente
    """
    try:
        signer = SignatureRequestSigner.objects.get(id=signer_id)
        signature_request = signer.signature_request
        
        # Verificar se ainda está pendente
        if signer.status not in ['pending', 'notified', 'viewed']:
            return f"Assinante {signer.email} não está mais pendente"
        
        # Preparar contexto do email
        context = {
            'signer': signer,
            'signature_request': signature_request,
            'document': signature_request.document,
            'organization': signature_request.organization,
            'access_url': f"{getattr(settings, 'FRONTEND_URL', '')}/sign/{signer.access_token}",
            'expires_at': signature_request.expires_at,
            'is_reminder': True
        }
        
        # Renderizar template de lembrete
        subject = f"Lembrete: Assinatura Pendente - {signature_request.title}"
        html_message = render_to_string('ordoc_sign/signature_reminder.html', context)
        text_message = render_to_string('ordoc_sign/signature_reminder.txt', context)
        
        # Enviar email
        send_mail(
            subject=subject,
            message=text_message,
            html_message=html_message,
            from_email=getattr(settings, 'DEFAULT_FROM_EMAIL', 'noreply@ordoc.ai'),
            recipient_list=[signer.email],
            fail_silently=False
        )
        
        # Log de auditoria
        SignatureAuditLog.objects.create(
            organization=signature_request.organization,
            signature_request=signature_request,
            action='signer_reminded',
            description=f'Lembrete enviado para: {signer.email}',
            user_email='system@ordoc.ai',
            user_name='Sistema'
        )
        
        logger.info(f"Lembrete enviado para {signer.email} - Solicitação {signature_request.id}")
        return f"Lembrete enviado com sucesso para {signer.email}"
        
    except SignatureRequestSigner.DoesNotExist:
        logger.error(f"Assinante {signer_id} não encontrado")
        return f"Assinante {signer_id} não encontrado"
    
    except Exception as e:
        logger.error(f"Erro ao enviar lembrete para assinante {signer_id}: {str(e)}")
        raise self.retry(countdown=60 * (2 ** self.request.retries), exc=e)


@shared_task
def process_signature_batch(batch_id):
    """
    Processa um lote de assinaturas
    """
    try:
        batch = SignatureBatch.objects.get(id=batch_id)
        success, message = SignatureBatchService.process_signature_batch(batch)
        
        if success:
            logger.info(f"Lote {batch.name} processado com sucesso")
            return f"Lote processado com sucesso: {message}"
        else:
            logger.error(f"Erro ao processar lote {batch.name}: {message}")
            return f"Erro ao processar lote: {message}"
            
    except SignatureBatch.DoesNotExist:
        logger.error(f"Lote {batch_id} não encontrado")
        return f"Lote {batch_id} não encontrado"
    
    except Exception as e:
        logger.error(f"Erro ao processar lote {batch_id}: {str(e)}")
        return f"Erro ao processar lote: {str(e)}"


@shared_task
def verify_document_signatures():
    """
    Verifica periodicamente a validade das assinaturas
    """
    try:
        # Buscar assinaturas válidas que precisam ser reverificadas
        signatures = DocumentSignature.objects.filter(
            status='valid',
            validated_at__lt=timezone.now() - timedelta(days=7)  # Reverificar a cada 7 dias
        )
        
        verified_count = 0
        invalid_count = 0
        
        for signature in signatures:
            try:
                is_valid, message = SignatureService.verify_document_signature(signature)
                if is_valid:
                    verified_count += 1
                else:
                    invalid_count += 1
                    logger.warning(f"Assinatura {signature.id} tornou-se inválida: {message}")
            except Exception as e:
                logger.error(f"Erro ao verificar assinatura {signature.id}: {str(e)}")
        
        logger.info(f"Verificação de assinaturas concluída: {verified_count} válidas, {invalid_count} inválidas")
        return f"Verificadas {verified_count + invalid_count} assinaturas"
        
    except Exception as e:
        logger.error(f"Erro na verificação de assinaturas: {str(e)}")
        return f"Erro na verificação: {str(e)}"


@shared_task
def check_certificate_expiration():
    """
    Verifica certificados que estão próximos do vencimento
    """
    try:
        # Certificados que expiram em 30 dias
        warning_date = timezone.now() + timedelta(days=30)
        expiring_certificates = DigitalCertificate.objects.filter(
            status='active',
            valid_until__lte=warning_date,
            valid_until__gte=timezone.now()
        )
        
        # Certificados já expirados
        expired_certificates = DigitalCertificate.objects.filter(
            status='active',
            valid_until__lt=timezone.now()
        )
        
        # Marcar certificados expirados
        expired_count = expired_certificates.update(status='expired')
        
        # Enviar notificações para certificados próximos do vencimento
        notification_count = 0
        for cert in expiring_certificates:
            try:
                days_until_expiry = (cert.valid_until.date() - timezone.now().date()).days
                
                context = {
                    'certificate': cert,
                    'user': cert.user,
                    'organization': cert.organization,
                    'days_until_expiry': days_until_expiry
                }
                
                subject = f"Certificado Digital expira em {days_until_expiry} dias"
                html_message = render_to_string('ordoc_sign/certificate_expiration_warning.html', context)
                text_message = render_to_string('ordoc_sign/certificate_expiration_warning.txt', context)
                
                send_mail(
                    subject=subject,
                    message=text_message,
                    html_message=html_message,
                    from_email=getattr(settings, 'DEFAULT_FROM_EMAIL', 'noreply@ordoc.ai'),
                    recipient_list=[cert.user.email],
                    fail_silently=False
                )
                
                notification_count += 1
                
                # Log de auditoria
                SignatureAuditLog.objects.create(
                    organization=cert.organization,
                    certificate=cert,
                    action='certificate_expiration_warning',
                    description=f'Aviso de expiração enviado - {days_until_expiry} dias',
                    user_email='system@ordoc.ai',
                    user_name='Sistema'
                )
                
            except Exception as e:
                logger.error(f"Erro ao notificar expiração do certificado {cert.id}: {str(e)}")
        
        logger.info(f"Verificação de certificados: {expired_count} expirados, {notification_count} notificações enviadas")
        return f"Processados {expired_count} certificados expirados e {notification_count} notificações"
        
    except Exception as e:
        logger.error(f"Erro na verificação de certificados: {str(e)}")
        return f"Erro na verificação: {str(e)}"


@shared_task
def process_expired_signature_requests():
    """
    Processa solicitações de assinatura expiradas
    """
    try:
        now = timezone.now()
        
        # Buscar solicitações expiradas
        expired_requests = SignatureRequest.objects.filter(
            status__in=['pending', 'in_progress'],
            expires_at__lt=now
        )
        
        expired_count = 0
        for request in expired_requests:
            try:
                request.expire()
                request.save()
                expired_count += 1
                
                # Log de auditoria
                SignatureAuditLog.objects.create(
                    organization=request.organization,
                    signature_request=request,
                    action='request_expired',
                    description='Solicitação expirada automaticamente',
                    user_email='system@ordoc.ai',
                    user_name='Sistema'
                )
                
                # Notificar criador da solicitação
                try:
                    context = {
                        'signature_request': request,
                        'organization': request.organization,
                        'created_by': request.created_by
                    }
                    
                    subject = f"Solicitação de Assinatura Expirada: {request.title}"
                    html_message = render_to_string('ordoc_sign/signature_request_expired.html', context)
                    text_message = render_to_string('ordoc_sign/signature_request_expired.txt', context)
                    
                    send_mail(
                        subject=subject,
                        message=text_message,
                        html_message=html_message,
                        from_email=getattr(settings, 'DEFAULT_FROM_EMAIL', 'noreply@ordoc.ai'),
                        recipient_list=[request.created_by.email],
                        fail_silently=False
                    )
                    
                except Exception as e:
                    logger.error(f"Erro ao notificar expiração da solicitação {request.id}: {str(e)}")
                
            except Exception as e:
                logger.error(f"Erro ao processar solicitação expirada {request.id}: {str(e)}")
        
        logger.info(f"Processadas {expired_count} solicitações expiradas")
        return f"Processadas {expired_count} solicitações expiradas"
        
    except Exception as e:
        logger.error(f"Erro ao processar solicitações expiradas: {str(e)}")
        return f"Erro ao processar: {str(e)}"


@shared_task
def send_signature_reminders():
    """
    Envia lembretes para assinantes pendentes
    """
    try:
        now = timezone.now()
        
        # Buscar solicitações que expiram em breve
        upcoming_expiry = SignatureRequest.objects.filter(
            status__in=['pending', 'in_progress'],
            expires_at__lte=now + timedelta(days=3),  # 3 dias antes do vencimento
            expires_at__gte=now
        )
        
        reminder_count = 0
        for request in upcoming_expiry:
            # Buscar assinantes pendentes
            pending_signers = request.signers.filter(
                status__in=['pending', 'notified', 'viewed']
            )
            
            for signer in pending_signers:
                try:
                    # Enviar lembrete assíncrono
                    send_signature_reminder.delay(signer.id)
                    reminder_count += 1
                except Exception as e:
                    logger.error(f"Erro ao agendar lembrete para {signer.id}: {str(e)}")
        
        logger.info(f"Agendados {reminder_count} lembretes de assinatura")
        return f"Agendados {reminder_count} lembretes"
        
    except Exception as e:
        logger.error(f"Erro ao agendar lembretes: {str(e)}")
        return f"Erro ao agendar lembretes: {str(e)}"


@shared_task
def cleanup_old_audit_logs():
    """
    Remove logs de auditoria antigos para economizar espaço
    """
    try:
        # Manter logs dos últimos 2 anos
        cutoff_date = timezone.now() - timedelta(days=730)
        
        deleted_count, _ = SignatureAuditLog.objects.filter(
            created_at__lt=cutoff_date
        ).delete()
        
        logger.info(f"Removidos {deleted_count} logs de auditoria antigos")
        return f"Removidos {deleted_count} logs antigos"
        
    except Exception as e:
        logger.error(f"Erro na limpeza de logs: {str(e)}")
        return f"Erro na limpeza: {str(e)}"


@shared_task
def generate_signature_reports():
    """
    Gera relatórios periódicos de assinaturas
    """
    try:
        from ordoc_air.models import Organization
        
        report_count = 0
        
        # Gerar relatório para cada organização
        for organization in Organization.objects.filter(is_active=True):
            try:
                # Gerar estatísticas do último mês
                end_date = timezone.now()
                start_date = end_date - timedelta(days=30)
                
                stats = SignatureReportService.generate_signature_statistics(
                    organization=organization,
                    start_date=start_date,
                    end_date=end_date
                )
                
                if stats and stats.get('summary', {}).get('total_requests', 0) > 0:
                    # Aqui você poderia salvar o relatório ou enviá-lo por email
                    # Por enquanto, apenas log
                    logger.info(f"Relatório gerado para {organization.corporate_name}: "
                              f"{stats['summary']['total_requests']} solicitações")
                    report_count += 1
                
            except Exception as e:
                logger.error(f"Erro ao gerar relatório para organização {organization.id}: {str(e)}")
        
        logger.info(f"Gerados {report_count} relatórios de assinatura")
        return f"Gerados {report_count} relatórios"
        
    except Exception as e:
        logger.error(f"Erro na geração de relatórios: {str(e)}")
        return f"Erro na geração: {str(e)}"


@shared_task
def sync_certificate_status():
    """
    Sincroniza status dos certificados com autoridades certificadoras
    """
    try:
        # Buscar certificados ativos para verificação
        active_certificates = DigitalCertificate.objects.filter(
            status='active',
            certificate_type__in=['A1', 'A3', 'CA_ISSUED']
        )
        
        updated_count = 0
        revoked_count = 0
        
        for certificate in active_certificates:
            try:
                # Verificar certificado
                is_valid, message = CertificateService.verify_certificate(certificate)
                
                if not is_valid and 'expirado' not in message.lower():
                    # Certificado pode ter sido revogado
                    certificate.status = 'revoked'
                    certificate.save()
                    revoked_count += 1
                    
                    # Log de auditoria
                    SignatureAuditLog.objects.create(
                        organization=certificate.organization,
                        certificate=certificate,
                        action='certificate_revoked',
                        description=f'Certificado revogado: {message}',
                        user_email='system@ordoc.ai',
                        user_name='Sistema'
                    )
                else:
                    updated_count += 1
                
            except Exception as e:
                logger.error(f"Erro ao verificar certificado {certificate.id}: {str(e)}")
        
        logger.info(f"Sincronização de certificados: {updated_count} verificados, {revoked_count} revogados")
        return f"Verificados {updated_count} certificados, {revoked_count} revogados"
        
    except Exception as e:
        logger.error(f"Erro na sincronização de certificados: {str(e)}")
        return f"Erro na sincronização: {str(e)}"
