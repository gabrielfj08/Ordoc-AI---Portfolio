module ProcedureSerializer
  class Base < ActiveModel::Serializer
    attributes :id, :department_id, :description, :document_number, :internal_process_number, :name, :parent_id, :procedure_template_id, :public, :status, :created_by_id, :created_at, :updated_at, :archived_at
  end
end
