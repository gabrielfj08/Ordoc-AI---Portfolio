module V3
  module RecentDocumentSerializer
    class List < Base
      has_one :document

      class DocumentSerializer < ActiveModel::Serializer
        attributes :id, :original_filename, :status, :description, :location,
                   :prn, :directory_id, :path, :url, :size, :created_at, :updated_at
      end
    end
  end
end
