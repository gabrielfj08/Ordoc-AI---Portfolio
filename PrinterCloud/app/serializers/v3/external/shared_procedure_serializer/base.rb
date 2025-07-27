module V3
  module External
    module SharedProcedureSerializer
      class Base < ActiveModel::Serializer
        attributes :id, :status, :external_requester_id, :procedure_id, :created_by_id, :created_at, :updated_at
      end
    end
  end
end
