module V3
  module DirectorySerializer
    class Show < Base
      has_one :created_by
      has_one :updated_by
      belongs_to :parent_directory
      attributes :path

      class UserSerializer < ActiveModel::Serializer
        attributes :id, :name
      end

      class DirectorySerializer < ActiveModel::Serializer
        attributes :id, :name
      end
    end
  end
end
