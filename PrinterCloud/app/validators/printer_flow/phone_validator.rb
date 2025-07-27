module PrinterFlow
  class PhoneValidator < ActiveModel::EachValidator
    def validate_each(record, _attribute, values)
      if values['value'].present?
        number_regex = /\d[0-9]\)*\z/

        unless number_regex.match?(values['value'])
          record.errors.add(values['label'],
                            I18n.t('printer_flow.errors.messages.is_invalid'))
        end
      else
        record.errors.add(values['label'], I18n.t('printer_flow.errors.messages.cannot_be_blank'))
      end
    end
  end
end
