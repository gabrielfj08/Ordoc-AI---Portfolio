module PrinterFlow
  class AttachmentValidator < ActiveModel::EachValidator
    def validate_each(record, _attribute, values)
      if values['value'].present?
        uuid_regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/

        unless values['value'].is_a?(Array)
          record.errors.add(values['label'], I18n.t('printer_flow.errors.messages.is_invalid'))
          return
        end

        values['value'].each do |uuid|
          unless uuid_regex.match?(uuid)
            record.errors.add(values['label'],
                              I18n.t('printer_flow.errors.messages.invalid_attachment'))
          end
        end
      else
        record.errors.add(values['label'], I18n.t('printer_flow.errors.messages.cannot_be_blank'))
      end
    end
  end
end
