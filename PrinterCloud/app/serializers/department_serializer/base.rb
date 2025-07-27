module DepartmentSerializer
  class Base < ActiveModel::Serializer
    attributes :id, :description, :name, :organization_id, :updated_at, :created_at
  end
end
