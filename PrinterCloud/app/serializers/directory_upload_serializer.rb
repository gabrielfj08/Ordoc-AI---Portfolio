class DirectoryUploadSerializer < ActiveModel::Serializer
  attributes :id, :ocr, :s3_object_key, :department_id, :directory_id, :documents, :created_at, :updated_at

  attribute(:status) { Sidekiq::Batch::Status.new(object.bid) if object.bid.present? }
end
