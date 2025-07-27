module V3
  module ProcedureTemplateDocumentSerializer
    class Base < ActiveModel::Serializer
      attributes :id, :name, :status, :procedure_template_id, :s3_key, :document_id, :created_by_id, :created_at,
                 :updated_at
    end
  end
end
