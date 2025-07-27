class RoleSerializer < ActiveModel::Serializer
  attributes :id, :type, :user_id, :organization_id, :department_id, :created_at, :updated_at

  attribute(:type) { object.class::SERIALIZED_TYPE }
end
