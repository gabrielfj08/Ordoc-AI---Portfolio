module V3
  module PolicySerializer
    class List < Base
      belongs_to :organization
      attributes :users_count, :user_groups_count

      class OrganizationSerializer < ActiveModel::Serializer
        attributes :corporate_name
      end
    end
  end
end
