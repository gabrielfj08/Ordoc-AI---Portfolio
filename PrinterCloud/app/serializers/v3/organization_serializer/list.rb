module V3
  module OrganizationSerializer
    class List < Base
      has_one :root_directory
      has_one :recycle_bin_directory
      has_many :apps

      class DirectorySerializer < ActiveModel::Serializer
        attributes :id
      end
    end
  end
end
