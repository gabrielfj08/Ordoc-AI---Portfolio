module V3
  module OrganizationSerializer
    class Show < Base
      has_one :address
      has_one :root_directory
      has_one :recycle_bin_directory
      has_many :apps
      attribute(:users_count) { object.printer_cloud_users.count }

      class AddressSerializer < ActiveModel::Serializer
        attributes :id, :street, :number, :complement, :postal_code, :city, :state, :neighborhood, :created_at,
                   :updated_at
      end

      class DirectorySerializer < ActiveModel::Serializer
        attributes :id
      end
    end
  end
end
