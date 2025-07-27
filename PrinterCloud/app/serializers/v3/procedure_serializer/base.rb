module V3
  module ProcedureSerializer
    class Base < ActiveModel::Serializer
      attributes :id, :deadline, :priority, :private, :prn, :organization_id, :process_number, :responsible_group_id,
                 :requester_id, :created_by_id, :procedure_template_name, :procedure_template_id, :source, :status,
                 :schema, :payload, :created_at, :updated_at
    end
  end
end
