module V3
  module External
    module TaskSerializer
      class Base < ActiveModel::Serializer
        attributes :id, :procedure_id, :name, :description, :status, :created_by_id, :created_at, :updated_at
      end
    end
  end
end
