module V3
  module External
    module ProcedureReportSerializer
      class Base < ActiveModel::Serializer
        attributes :id, :status, :document_id, :procedure_id, :procedure_status, :created_at, :updated_at
      end
    end
  end
end
