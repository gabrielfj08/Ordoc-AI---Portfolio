module PrinterFlow
  class FieldAttachment < ApplicationRecord
    self.table_name = 'printer_flow.field_attachments'

    before_commit :ensure_field_type_is_attachment

    belongs_to :field, class_name: 'PrinterFlow::Field'
    belongs_to :field_document_template, class_name: 'PrinterFlow::FieldDocumentTemplate'

    has_one :procedure_template, through: :field, class_name: 'PrinterFlow::ProcedureTemplate', touch: true

    private

    def ensure_field_type_is_attachment
      raise Error::PrinterFlow::FieldTypeIsNotAttachment unless field.field_type == 'attachment'
    end
  end
end
