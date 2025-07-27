module V3
  module PolicyAttachmentSerializer
    class Base < ActiveModel::Serializer
      attributes :id, :policy_attachable_type
    end
  end
end
