module V3
  module ProcedureTemplateSerializer
    class Base < ActiveModel::Serializer
      attributes :id, :name, :prn, :source, :status, :organization_id, :parent_procedure_template_id, :group_requester_id, :created_at,
                 :updated_at
    end
  end
end
