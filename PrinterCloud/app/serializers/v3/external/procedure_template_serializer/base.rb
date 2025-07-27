module V3
  module External
    module ProcedureTemplateSerializer
      class Base < ActiveModel::Serializer
        attributes :id, :name
      end
    end
  end
end
