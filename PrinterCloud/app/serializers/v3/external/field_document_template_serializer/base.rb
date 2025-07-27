module V3
  module External
    module FieldDocumentTemplateSerializer
      class Base < ActiveModel::Serializer
        attributes :id, :name
      end
    end
  end
end
