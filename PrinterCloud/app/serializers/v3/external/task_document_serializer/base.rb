module V3
  module External
    module TaskDocumentSerializer
      class Base < ActiveModel::Serializer
        attributes :id, :status, :task_id, :s3_key, :name, :signed_document_id, :document_id, :uuid, :created_by_id, :created_at,
                   :updated_at
      end
    end
  end
end
