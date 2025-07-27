module PrinterCloud
  module UserSerializer
    class Base < ActiveModel::Serializer
      attributes :id, :email, :name, :cpf, :phone, :date_of_birth, :status, :avatar_url, :created_at, :updated_at
    end
  end
end
