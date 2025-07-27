module ProcedureTemplateAttachmentSerializer
  class Base < ActiveModel::Serializer
    attributes :id, :name, :created_at, :updated_at, :procedure_template_id

    attribute(:url) { Rails.application.routes.url_helpers.rails_blob_path(object.file.attachment, only_path: true) if object.file.attached? }
  end
end
