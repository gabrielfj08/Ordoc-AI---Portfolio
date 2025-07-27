module V3
  module TaskAttachmentSerializer
    class Base < ActiveModel::Serializer
      attributes :id, :attachable_id, :attachable_type, :task_id, :created_by_id, :created_at, :updated_at

      attribute(:attachable_type) { object.attachable_type.demodulize.underscore }
    end
  end
end
