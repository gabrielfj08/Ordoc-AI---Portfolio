module V3
  module UserGroupSerializer
    class Base < ActiveModel::Serializer
      belongs_to :organization
      attributes :id, :name, :description, :organization_id, :status, :prn, :created_at, :updated_at

      class OrganizationSerializer < ActiveModel::Serializer
        attributes :corporate_name
      end
    end
  end
end
