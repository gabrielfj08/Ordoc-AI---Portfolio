module PrinterFlow
  class NumericValidator < ActiveModel::EachValidator
    def validate_each(record, _attribute, values)
      if values['value'].present?
        unless values['value'] !~ /\D/
          record.errors.add(values['label'],
                            I18n.t('printer_flow.errors.messages.only_numeric'))
        end
      else
        record.errors.add(values['label'], I18n.t('printer_flow.errors.messages.cannot_be_blank'))
      end
    end
  end
end
