module Admin
  module RoleSerializer
    class Base < ActiveModel::Serializer
      attributes :id, :user_id, :type, :organization_id, :department_id,:created_at, :updated_at

      attribute(:type) { object.class::SERIALIZED_TYPE }
    end
  end
end
