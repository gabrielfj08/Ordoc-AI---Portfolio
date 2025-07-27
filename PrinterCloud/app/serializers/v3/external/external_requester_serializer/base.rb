module V3
  module External
    module ExternalRequesterSerializer
      class Base < ActiveModel::Serializer
        attributes :id, :name, :email, :cpf_cnpj, :birth_date, :phone, :optional_email,
                   :optional_phone, :occupation, :notification, :status, :blocked, :prn,
                   :organization_id, :changed_password, :created_at, :updated_at
      end
    end
  end
end
