module V3
  module External
    module ProcedureSerializer
      class Base < ActiveModel::Serializer
        attributes :id, :prn, :organization_id, :process_number, :responsible_group_id,
                   :requester_id, :created_by_id, :procedure_template_name, :procedure_template_id, :status,
                   :schema, :payload, :created_at, :updated_at
      end
    end
  end
end
