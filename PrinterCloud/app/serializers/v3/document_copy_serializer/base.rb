module V3
  module DocumentCopySerializer
    class Base < ActiveModel::Serializer
      attributes :id, :status, :document_id, :created_by_id, :created_at, :updated_at
    end
  end
end
