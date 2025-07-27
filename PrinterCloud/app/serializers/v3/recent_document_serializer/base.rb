module V3
  module RecentDocumentSerializer
    class Base < ActiveModel::Serializer
      attributes :document_id, :last_accessed_at, :user_id
    end
  end
end
