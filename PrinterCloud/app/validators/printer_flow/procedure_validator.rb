module PrinterFlow
  class ProcedureValidator < ActiveModel::Validator
    def validate(record)
      return unless record.new_record?

      ensure_requester_is_active(record)
      ensure_procedure_template_has_parent(record)
      ensure_field_has_options(record)
    end

    private

    def ensure_requester_is_active(record)
      return if record.requester.active?

      record.errors.add(:requester,
                        message: I18n.t('activerecord.errors.messages.requester_must_be_active',
                                        attribute: record.organization.corporate_name))
    end

    def ensure_procedure_template_has_parent(record)
      return unless record.external? && record.procedure_template.parent_procedure_template_id.nil?

      record.errors.add(:procedure_template,
                        message: I18n.t('activerecord.errors.messages.ensure_procedure_template_has_parent'))
    end

    def ensure_field_has_options(record)
      record.procedure_template.fields.selectable.each do |field|
        next if field.field_value_options.present?

        record.errors.add(:field_value_option,
                          I18n.t('printer_flow.errors.messages.field_value_option_must_be_present'))
      end
    end
  end
end
