module ShareableLinkSerializer
  class Base < ActiveModel::Serializer
    attributes :id, :status, :document_id, :expires_in, :shareable_link, :created_at
  end
end
