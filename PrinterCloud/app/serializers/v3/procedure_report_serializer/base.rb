module V3
  module ProcedureReportSerializer
    class Base < ActiveModel::Serializer
      attributes :id, :created_by_id, :document_id, :procedure_id, :status, :created_at, :updated_at
    end
  end
end
