module V3
  module SharedDirectoriesSerializer
    class List < Base
      has_one :directory
      belongs_to :created_by
      attributes :path

      class DirectorySerializer < ActiveModel::Serializer
        attributes :id, :name, :description
      end

      class UserSerializer < ActiveModel::Serializer
        attributes :id, :name
      end
    end
  end
end
