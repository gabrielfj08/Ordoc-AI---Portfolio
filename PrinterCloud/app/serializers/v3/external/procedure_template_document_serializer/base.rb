module V3
  module External
    module ProcedureTemplateDocumentSerializer
      class Base < ActiveModel::Serializer
        attributes :id, :name
      end
    end
  end
end
