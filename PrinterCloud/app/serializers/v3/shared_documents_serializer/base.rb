module V3
  module SharedDocumentsSerializer
    class Base < ActiveModel::Serializer
      attributes :id, :parent_shared_id, :record_type, :object_prn, :organization_id, :prn, :user_id, :created_at,
                 :updated_at
    end
  end
end
