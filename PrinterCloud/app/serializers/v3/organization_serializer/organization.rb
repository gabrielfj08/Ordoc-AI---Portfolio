module V3
  module OrganizationSerializer
    class Organization < Base
      has_one :root_directory
      has_one :recycle_bin_directory
      has_one :theme
      has_one :address

      class DirectorySerializer < V3::DirectorySerializer::Base
      end

      class ThemeSerializer < V3::ThemeSerializer::Base
      end

      class AddressSerializer < V3::External::AddressSerializer::Base
      end
    end
  end
end
