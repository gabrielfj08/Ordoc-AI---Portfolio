module V3
  module UserSerializer
    class Base < ActiveModel::Serializer
      attributes :id, :name, :email, :cpf, :date_of_birth, :avatar_url, :organization_id, :phone, :prn, :status,
                 :username, :changed_password, :registration_number, :created_at, :updated_at, :deleted_at
    end
  end
end
