module V3
  module FieldSerializer
    class Show < Base
      has_one :field_document_template

      class FieldDocumentTemplateSerializer < V3::FieldDocumentTemplateSerializer::Show
      end
    end
  end
end
