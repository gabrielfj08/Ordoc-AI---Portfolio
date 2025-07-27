module V3
  module External
    module FieldSerializer
      class List < Base
        has_one :field_document_template
        has_many :field_value_options

        class FieldDocumentTemplateSerializer < V3::External::FieldDocumentTemplateSerializer::Show
        end

        class FieldValueOptionSerializer < V3::External::FieldValueOptionSerializer::Show
        end
      end
    end
  end
end
