module V3
  module FieldSerializer
    class List < Base
      has_one :field_document_template
      has_many :field_value_options

      class FieldDocumentTemplateSerializer < V3::FieldDocumentTemplateSerializer::Show
      end

      class FieldValueOptionSerializer < V3::FieldValueOptionSerializer::Base
      end
    end
  end
end
