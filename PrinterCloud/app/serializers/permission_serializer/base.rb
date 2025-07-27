module PermissionSerializer
  class Base < ActiveModel::Serializer
    attributes :id, :document_id, :directory_id,  :user_id, :deleted_at
    has_one :permission_granted_by
    attribute(:scope){ object.scope }

    class UserSerializer < ActiveModel::Serializer
      attributes :id, :name
    end
  end
end
