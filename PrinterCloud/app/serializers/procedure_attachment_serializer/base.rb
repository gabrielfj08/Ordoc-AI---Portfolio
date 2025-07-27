module ProcedureAttachmentSerializer
  class Base < ActiveModel::Serializer
    attributes :id, :name, :created_at, :updated_at, :url

    attribute(:signed) { object.procedure_attachment_signatures.present? }
  end
end
