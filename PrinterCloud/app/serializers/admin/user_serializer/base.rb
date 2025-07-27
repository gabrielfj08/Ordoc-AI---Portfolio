module Admin
  module UserSerializer
    class Base < ActiveModel::Serializer
      attributes :id, :name, :email, :cpf, :phone, :date_of_birth, :status, :created_at, :updated_at, :deleted_at
    end
  end
end
