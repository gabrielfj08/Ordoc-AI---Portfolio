module V3
  module DocumentUploadJobSerializer
    class Base < ActiveModel::Serializer
      attributes :id, :status, :s3_key, :description, :location, :created_by_id, :created_at, :updated_at
    end
  end
end
