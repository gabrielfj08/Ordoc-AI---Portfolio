module V3
  module ShareableLinkSerializer
    class Base < ActiveModel::Serializer
      attributes :id, :uuid, :expires_in, :expires_at, :document_prn, :created_at, :updated_at, :link, :created_by_id
    end
  end
end
