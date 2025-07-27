module V3
  module PolicyAttachmentSerializer
    class List < Base
      belongs_to :policy_attachable

      class UserSerializer < ActiveModel::Serializer
        attributes :id, :name
      end

      class UserGroupSerializer < ActiveModel::Serializer
        attributes :id, :name
      end
    end
  end
end
