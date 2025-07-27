module PartakerSerializer
  class Base < ActiveModel::Serializer
    attributes :id, :address, :cpf_cnpj, :email, :name, :notes, :organization_id, :phone, :status, :created_at, :updated_at
  end
end
