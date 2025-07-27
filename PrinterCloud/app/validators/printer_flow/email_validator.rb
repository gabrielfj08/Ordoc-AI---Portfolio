module PrinterFlow
  class EmailValidator < ActiveModel::EachValidator
    def validate_each(record, _attribute, values)
      if values['value'].present?
        unless values['value'] =~ /\A(\S+)@(.+)\.(\S+)\z/
          record.errors.add(values['label'],
                            I18n.t('printer_flow.errors.messages.is_invalid'))
        end
      else
        record.errors.add(values['label'], I18n.t('printer_flow.errors.messages.cannot_be_blank'))
      end
    end
  end
end
