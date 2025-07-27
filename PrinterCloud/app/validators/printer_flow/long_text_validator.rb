module PrinterFlow
  class LongTextValidator < ActiveModel::EachValidator
    def validate_each(record, _attribute, values)
      if values['value'].present?
        if values['value'].length > 4_000_000
          record.errors.add(values['label'],
                            I18n.t('printer_flow.errors.messages.exceeds_long_text_character_limit'))
        end
      else
        record.errors.add(values['label'], I18n.t('printer_flow.errors.messages.cannot_be_blank'))
      end
    end
  end
end
