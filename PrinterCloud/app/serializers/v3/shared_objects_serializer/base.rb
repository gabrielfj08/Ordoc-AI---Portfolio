module V3
  module SharedObjectsSerializer
    class Base < ActiveModel::Serializer
      attributes :id, :record_type, :object_prn, :parent_shared_id, :organization_id, :prn, :created_by_id, :created_at,
                 :updated_at
    end
  end
end
