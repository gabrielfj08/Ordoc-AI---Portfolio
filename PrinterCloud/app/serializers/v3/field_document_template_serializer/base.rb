module V3
  module FieldDocumentTemplateSerializer
    class Base < ActiveModel::Serializer
      attributes :id, :name, :status, :organization_id, :s3_key, :document_id, :created_at, :updated_at
    end
  end
end
