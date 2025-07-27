module V3
  module DirectorySerializer
    class Base < ActiveModel::Serializer
      attributes :id, :name, :description, :organization_id, :prn, :parent_directory_id,
                 :previous_parent_prn, :created_at, :updated_at
    end
  end
end
