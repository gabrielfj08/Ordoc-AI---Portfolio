module V3
  module DocumentSerializer
    class Base < ActiveModel::Serializer
      attributes :id, :original_filename, :status, :description, :location, :directory_id, :path, :prn,
                 :previous_parent_prn, :created_at, :updated_at, :deleted_at
    end
  end
end
