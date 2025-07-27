module Admin
  module DepartmentSerializer
    class Base < ActiveModel::Serializer
      attributes :id, :name, :description, :organization_id, :updated_at, :created_at
    end
  end
end
