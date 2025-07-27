# Preview all emails at http://localhost:3000/rails/mailers/external_requester_notifier_mailer
class ExternalRequesterNotifierMailerPreview < ActionMailer::Preview
  def send_one_time_password_notification
    requester = PrinterFlow::ExternalRequester.last
    ExternalRequesterNotifierMailer.with(requester: requester).send_one_time_password_notification(requester)
  end

  def send_password_notification
    requester = PrinterFlow::ExternalRequester.last

    ExternalRequesterNotifierMailer.with(requester: requester).send_password_notification(requester)
  end

  def send_password_changed_notification
    requester = PrinterFlow::ExternalRequester.last

    ExternalRequesterNotifierMailer.with(requester: requester).send_password_changed_notification(requester)
  end

  def send_procedure_created_notification
    requester = PrinterFlow::ExternalRequester.last
    procedure = PrinterFlow::Procedure.where(requester_id: requester.id).last

    ExternalRequesterNotifierMailer.with(requester: requester, procedure: procedure)
                                   .send_procedure_created_notification(requester, procedure)
  end

  def send_procedure_archived_notification
    requester = PrinterFlow::ExternalRequester.last
    procedure = PrinterFlow::Procedure.where(requester_id: requester.id).last

    ExternalRequesterNotifierMailer.with(requester: requester, procedure: procedure)
                                   .send_procedure_archived_notification(requester, procedure)
  end

  def send_procedure_unarchived_notification
    requester = PrinterFlow::ExternalRequester.last
    procedure = PrinterFlow::Procedure.where(requester_id: requester.id).last

    ExternalRequesterNotifierMailer.with(requester: requester, procedure: procedure)
                                   .send_procedure_unarchived_notification(requester, procedure)
  end

  def send_procedure_finished_notification
    requester = PrinterFlow::ExternalRequester.last
    procedure = PrinterFlow::Procedure.where(requester_id: requester.id).last

    ExternalRequesterNotifierMailer.with(requester: requester, procedure: procedure)
                                   .send_procedure_finished_notification(requester, procedure)
  end

  def send_task_created_for_requester_notification
    assignee = PrinterFlow::ExternalRequester.second
    task = PrinterFlow::Task.where(assignee_id: assignee.id).last

    ExternalRequesterNotifierMailer.with(assignee: assignee, task: task)
                                   .send_task_created_for_requester_notification(assignee, task)
  end

  def send_task_refused_by_internal_requester_notification
    requester = PrinterFlow::ExternalRequester.second
    task = PrinterFlow::Task.where(assignee_id: requester.id).last

    ExternalRequesterNotifierMailer.with(requester: requester, task: task)
                                   .send_task_refused_by_internal_requester_notification(requester, task)
  end

  def send_signature_created_notification
    requester = PrinterFlow::ExternalRequester.second
    signature = PrinterSign::Signature.where(requester_id: requester.id).last

    ExternalRequesterNotifierMailer.with(requester: requester, signature: signature)
                                   .send_signature_created_notification(requester, signature)
  end

  def send_shared_procedure_created_notification
    requester = PrinterFlow::ExternalRequester.second
    shared_procedure = PrinterFlow::External::SharedProcedure.where(external_requester_id: requester.id).last

    ExternalRequesterNotifierMailer.with(requester: requester, shared_procedure: shared_procedure)
                                   .send_shared_procedure_created_notification(requester, shared_procedure)
  end

  def send_shared_procedure_refused_notification
    requester = PrinterFlow::ExternalRequester.second
    shared_procedure = PrinterFlow::External::SharedProcedure.where(external_requester_id: requester.id).last

    ExternalRequesterNotifierMailer.with(requester: requester, shared_procedure: shared_procedure)
                                   .send_shared_procedure_refused_notification(requester, shared_procedure)
  end
end
