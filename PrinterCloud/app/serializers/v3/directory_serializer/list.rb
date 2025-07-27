module V3
  module DirectorySerializer
    class List < Base
      belongs_to :updated_by
      belongs_to :parent_directory
      attributes :created_by_id, :path
      attribute(:shared) { object.shared? }

      class DirectorySerializer < ActiveModel::Serializer
        attributes :id, :name
      end

      class UserSerializer < ActiveModel::Serializer
        attributes :id, :name
      end
    end
  end
end
