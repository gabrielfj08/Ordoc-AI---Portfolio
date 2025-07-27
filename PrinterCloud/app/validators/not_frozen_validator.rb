class NotFrozenValidator < ActiveModel::EachValidator
  def validate_each(record, attribute, _value)
    return if record.draft? || attribute == :status

    record.errors.add(:status, I18n.t('printer_flow.errors.messages.procedure_invalid_to_update'))
  end
end
