module V3
  module RequesterSerializer
    class Base < ActiveModel::Serializer
      attributes :id, :name, :organization_id, :parent_group_id, :cpf_cnpj, :prn, :code, :email, :optional_email, :type, :status, :blocked,
                 :phone, :optional_phone, :occupation, :birth_date, :created_at, :updated_at
    end
  end
end
