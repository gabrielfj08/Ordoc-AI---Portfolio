module V3
  module SharedDocumentsSerializer
    class List < Base
      has_one :document
      belongs_to :created_by

      class DocumentSerializer < ActiveModel::Serializer
        attributes :id, :original_filename, :location, :description, :byte_size, :url, :download_url
      end

      class UserSerializer < ActiveModel::Serializer
        attributes :id, :name
      end
    end
  end
end
