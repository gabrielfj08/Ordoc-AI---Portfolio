module V3
  module External
    module SignatureSerializer
      class Base < ActiveModel::Serializer
        attributes :id, :signable_id, :signable_type, :requester_id, :status, :service, :token, :procedure_id,
                   :created_by_id, :created_at, :updated_at
      end
    end
  end
end
