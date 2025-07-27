module V3
  module External
    module ExternalRequesterSerializer
      class Show < Base
        has_one :address

        class AddressSerializer < AddressSerializer::Show
        end
      end
    end
  end
end
