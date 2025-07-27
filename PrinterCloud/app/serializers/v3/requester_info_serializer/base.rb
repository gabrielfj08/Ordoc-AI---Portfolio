module V3
  module RequesterInfoSerializer
    class Base < ActiveModel::Serializer
      attributes :id, :status, :procedures_count, :requester_id, :created_by_id,
                 :created_at, :updated_at
    end
  end
end
