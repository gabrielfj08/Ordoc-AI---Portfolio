module V3
  module DocumentVersionSerializer
    class Show < Base
      belongs_to :created_by

      attribute(:url) { object.download_url }

      class UserSerializer < ActiveModel::Serializer
        attributes :id, :name
      end
    end
  end
end
