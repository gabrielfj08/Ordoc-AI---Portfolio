module V3
  module External
    module AddressSerializer
      class Base < ActiveModel::Serializer
        attributes :id, :street, :number, :complement, :city, :state, :postal_code, :neighborhood,
                  :created_at, :updated_at
      end
    end
  end
end
