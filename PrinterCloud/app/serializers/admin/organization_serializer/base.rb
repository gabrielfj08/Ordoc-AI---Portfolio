module Admin
  module OrganizationSerializer
    class Base < ActiveModel::Serializer
      attributes :id, :contact_name, :contact_phone, :corporate_name, :cnpj, :email, :logo_url, :phone, :site, :status, :storage_limit, :deleted_at, :created_at, :updated_at
      
      has_many :apps
    end
  end
end
