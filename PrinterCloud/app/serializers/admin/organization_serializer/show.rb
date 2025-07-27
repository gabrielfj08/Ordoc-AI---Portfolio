module Admin
  module OrganizationSerializer
    class Show < Base
      has_one :address

      class AddressSerializer < ActiveModel::Serializer
        attributes :id, :street, :number, :complement, :postal_code, :city, :state, :neighborhood, :created_at, :updated_at, :deleted_at
      end
    end
  end
end
