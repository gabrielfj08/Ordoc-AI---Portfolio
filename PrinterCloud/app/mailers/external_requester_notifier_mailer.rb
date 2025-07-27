class ExternalRequesterNotifierMailer < ApplicationMailer
  DELIVERY_OPTIONS = {
    user_name: Rails.application.credentials.dig(:aws_ses, :access_key_id),
    password: Rails.application.credentials.dig(:aws_ses, :secret_access_key),
    domain: 'printercloud.com.br',
    address: 'email-smtp.sa-east-1.amazonaws.com',
    port: 587,
    authentication: :login,
    enable_starttls_auto: true
  }

  default from: 'flowcidadao@printercloud.com.br'
  default delivery_method_options: DELIVERY_OPTIONS

  def send_password_notification(requester)
    @requester = requester
    @password = @requester.generate_password
    @requester.save

    mail(to: @requester.email,
         subject: 'Senha temporária - Flow Cidadão')
  end

  def send_one_time_password_notification(requester)
    requester.generate_one_time_password
    @requester = requester

    mail(to: @requester.email,
         subject: 'Recuperação de conta - Flow Cidadão')
  end

  def send_password_changed_notification(requester)
    @requester = requester

    mail(to: @requester.email,
         subject: 'Alteração de senha - Flow Cidadão')
  end

  def send_procedure_created_notification(requester, procedure)
    @requester = requester
    @procedure = procedure

    mail(to: @requester.email,
         subject: 'Novo processo - Flow Cidadão')
  end

  def send_procedure_archived_notification(requester, procedure)
    @requester = requester
    @procedure = procedure

    mail(to: @requester.email,
         subject: 'Processo arquivado - Flow Cidadão')
  end

  def send_procedure_unarchived_notification(requester, procedure)
    @requester = requester
    @procedure = procedure

    mail(to: @requester.email,
         subject: 'Processo desarquivado - Flow Cidadão')
  end

  def send_procedure_finished_notification(requester, procedure)
    @requester = requester
    @procedure = procedure

    mail(to: @requester.email,
         subject: 'Processo finalizado - Flow Cidadão')
  end

  def send_task_created_for_requester_notification(assignee, task)
    @requester = assignee
    @task = task

    mail(to: @requester.email,
         subject: 'Nova tarefa - Flow Cidadão')
  end

  def send_task_refused_by_internal_requester_notification(requester, task)
    @requester = requester
    @task = task

    mail(to: @requester.email,
         subject: 'Tarefa recusada - Flow Cidadão')
  end

  def send_signature_created_notification(requester, signature)
    @requester = requester
    @signature = signature

    mail(to: @requester.email,
         subject: 'Nova assinatura - Flow Cidadão')
  end

  def send_shared_procedure_created_notification(requester, shared_procedure)
    @requester = requester
    @shared_procedure = shared_procedure

    mail(to: @requester.email,
         subject: 'Novo compartilhamento - Flow Cidadão')
  end

  def send_shared_procedure_refused_notification(requester, shared_procedure)
    @requester = requester
    @shared_procedure = shared_procedure

    mail(to: @requester.email,
         subject: 'Compartilhamento recusado - Flow Cidadão')
  end
end
