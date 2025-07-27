module TaskAttachmentsSerializer
  class Base < ActiveModel::Serializer
    attributes :id, :name, :created_at, :updated_at, :url

    attribute(:signed) { object.task_attachment_signatures.signed.present? }
  end
end
