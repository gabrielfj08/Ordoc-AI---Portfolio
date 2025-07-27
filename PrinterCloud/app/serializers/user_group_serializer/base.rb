module UserGroupSerializer
  class Base < ActiveModel::Serializer
    attributes :id, :name, :notes, :organization_id, :status, :created_at, :updated_at
  end
end
