class EachFieldValidator < ActiveModel::EachValidator
  def validate_each(record, attribute, _values)
    if record.schema.count != record.payload.count
      record.errors.add(:payload,
                        I18n.t('printer_flow.errors.messages.invalid_payload'))
    end

    record.payload.each do |field|
      "printer_flow/#{field['field_type']}_validator".classify.constantize.new(attributes: field['field_type']).validate_each(record,
                                                                                                                              attribute, field)
    end
  end
end
