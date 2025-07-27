module ProcedureAttachmentSignatureSerializer
  class Base < ActiveModel::Serializer
    attributes :id, :procedure_attachment_id, :user_id, :signature, :status, :created_at, :updated_at
  end
end
