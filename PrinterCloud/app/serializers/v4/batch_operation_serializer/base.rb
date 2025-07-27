module V4
  module BatchOperationSerializer
    class Base < ActiveModel::Serializer
      attributes :id, :ids, :payload, :action, :record_type, :created_by_id, :status, :created_at, :updated_at
    end
  end
end
