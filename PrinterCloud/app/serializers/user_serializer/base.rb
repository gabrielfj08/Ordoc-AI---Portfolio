module UserSerializer
  class Base < ActiveModel::Serializer
    attributes :id, :email, :name, :cpf, :phone, :date_of_birth, :status, :sign_in_count, :current_sign_in_at,
               :last_sign_in_at, :current_sign_in_ip, :last_sign_in_ip, :created_at, :updated_at

    attribute(:roles) { object.roles.map { |role| RoleSerializer.new(role) } }
  end
end
