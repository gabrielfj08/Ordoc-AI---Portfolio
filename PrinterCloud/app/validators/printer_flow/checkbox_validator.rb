module PrinterFlow
  class CheckboxValidator < ActiveModel::EachValidator
    def validate_each(record, _attribute, values)
      if values['value'].present?
        unless values['value'].is_a?(Array)
          record.errors.add(values['label'], I18n.t('printer_flow.errors.messages.is_invalid'))
          return
        end

        values['value'].each do |value|
          unless values['options'].include?(value)
            record.errors.add(values['label'],
                              I18n.t('printer_flow.errors.messages.is_invalid'))
          end
        end
      else
        record.errors.add(values['label'], I18n.t('printer_flow.errors.messages.cannot_be_blank'))
      end
    end
  end
end
