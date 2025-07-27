module V4
  module ProcedureDocumentSerializer
    class Base < ActiveModel::Serializer
      attributes :id, :status, :procedure_id, :key, :source, :name, :signed_document_id, :document_id, :uuid,
                 :created_by_id, :created_at, :updated_at
    end
  end
end
