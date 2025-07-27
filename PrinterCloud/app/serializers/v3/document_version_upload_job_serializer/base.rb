module V3
  module DocumentVersionUploadJobSerializer
    class Base < ActiveModel::Serializer
      attributes :id, :status, :s3_key, :location, :description, :document_id, :created_by_id, :created_at, :updated_at
    end
  end
end
