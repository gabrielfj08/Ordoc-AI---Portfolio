module V3
  module DocumentVersionSerializer
    class Base < ActiveModel::Serializer
      attributes :id, :original_filename, :description, :location, :status, :directory_id, :prn,
                 :version_id, :created_at, :updated_at
    end
  end
end
