module V3
  module DocumentVersionSerializer
    class List < Base
      belongs_to :created_by

      attribute(:url) { object.download_url }

      class UserSerializer < ActiveModel::Serializer
        attributes :id, :name
      end
    end
  end
end
