module PrinterFlow
  class TaskValidator < ActiveModel::Validator
    def validate(record)
      ensure_task_template_is_active(record)

      ensure_procedure_is_not_closed(record)

      ensure_draft_procedure_has_payload_attachments(record)

      ensure_group_assignee_is_valid(record)

      ensure_task_can_have_template(record)
    end

    private

    def ensure_procedure_is_not_closed(record)
      return unless (record.new_record? || record.changed?) && record.procedure.closed?

      raise Error::CustomError.new(:unprocessable_entity, 422,
                                   I18n.t('activerecord.errors.messages.procedure_is_finished_or_archived'))
    end

    def ensure_task_template_is_active(record)
      return unless record.new_record? && record.task_template_id.present? && record.task_template.inactive?

      record.errors.add(:task_template,
                        I18n.t('activerecord.errors.messages.task_template_is_archived'))
    end

    def ensure_draft_procedure_has_payload_attachments(record)
      return unless (record.new_record? || record.changed?) && record.procedure.schema.present?

      record.procedure.payload.map do |payload|
        next unless payload['field_type'] == 'attachment'

        raise Error::PrinterFlow::PayloadIsNotFullyFilled if payload['value'].blank?
      end
    end

    def ensure_group_assignee_is_valid(record)
      if record.changed? && record.procedure.internal? && record.group_assignee.present? && record.group_assignee.instance_of?(PrinterFlow::ExternalRequester)

        record.errors.add(:assignee, :invalid)
      end
    end

    def ensure_task_can_have_template(record)
      return unless record.new_record? && record.procedure.external? && record.task_template_id.present?

      record.errors.add(:task_template,
                        I18n.t('activerecord.errors.messages.only_internal_procedures_can_have_task_with_template'))
    end
  end
end
