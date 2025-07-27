module PrinterFlow
  class TimeValidator < ActiveModel::EachValidator
    def validate_each(record, _attribute, values)
      if values['value'].present?
        time_regex = /([0-1][0-9]|2[0-3]):[0-5][0-9]/
        if values['value'].length == 5 && time_regex.match?(values['value'])
          begin
            Time.parse(values['value'])
          rescue StandardError
            record.errors.add(values['label'], I18n.t('printer_flow.errors.messages.is_invalid'))
          end
        else
          record.errors.add(values['label'], I18n.t('printer_flow.errors.messages.is_invalid'))
        end
      else
        record.errors.add(values['label'], I18n.t('printer_flow.errors.messages.cannot_be_blank'))
      end
    end
  end
end
