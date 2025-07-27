module V3
  module OrganizationSerializer
    class Base < ActiveModel::Serializer
      attributes :id, :contact_name, :contact_phone, :corporate_name, :cnpj, :email, :logo_url, :phone, :prn, :site, :status,
                 :subdomain, :storage_limit, :created_at, :updated_at
    end
  end
end
