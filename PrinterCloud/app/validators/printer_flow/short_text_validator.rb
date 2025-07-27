module PrinterFlow
  class ShortTextValidator < ActiveModel::EachValidator
    def validate_each(record, _attribute, values)
      if values['value'].present?
        if values['value'].length > 255
          record.errors.add(values['label'],
                            I18n.t('printer_flow.errors.messages.exceeds_short_text_character_limit'))
        end
      else
        record.errors.add(values['label'], I18n.t('printer_flow.errors.messages.cannot_be_blank'))
      end
    end
  end
end
