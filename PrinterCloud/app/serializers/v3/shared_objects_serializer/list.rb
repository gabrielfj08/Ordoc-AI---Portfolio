module V3
  module SharedObjectsSerializer
    class List < Base
      belongs_to :user

      class UserSerializer < ActiveModel::Serializer
        attributes :id, :name, :avatar_url, :email
      end
    end
  end
end
