module BatchOperationSerializer
  class Base < ActiveModel::Serializer
    attributes :id, :record_type, :action, :ids, :status, :payload, :created_at, :created_by_id
  end
end
