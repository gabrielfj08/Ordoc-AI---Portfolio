module ProcedureTemplateSerializer
  class Base < ActiveModel::Serializer
    attributes :id, :organization_id, :description, :name, :status, :created_at, :updated_at
  end
end
