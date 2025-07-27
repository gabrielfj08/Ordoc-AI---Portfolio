module ProcedurePdfSerializer
  class Base < ActiveModel::Serializer
    attributes :id, :name, :procedure_id, :status, :created_at, :updated_at
  end
end
