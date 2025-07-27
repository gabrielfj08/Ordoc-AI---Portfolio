module V3
  module External
    module FieldSerializer
      class Show < Base
        has_one :field_document_template

        class FieldDocumentTemplateSerializer < V3::External::FieldDocumentTemplateSerializer::Show
        end
      end
    end
  end
end
