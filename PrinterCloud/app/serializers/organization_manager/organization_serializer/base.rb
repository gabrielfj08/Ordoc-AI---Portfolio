module OrganizationManager
  module OrganizationSerializer
    class Base < ActiveModel::Serializer
      include Rails.application.routes.url_helpers

      attributes :id, :contact_name, :contact_phone, :corporate_name, :cnpj, :email, :logo_url, :phone, :site, :created_at, :updated_at

      has_one :recycle_bin
    end
  end
end
