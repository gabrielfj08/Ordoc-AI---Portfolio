module V3
  module ProcedureTemplateDocumentSerializer
    class Show < Base
      attribute(:document_url) { object.document.url if object.document.present? }
    end
  end
end
