class ChildrenDirectorySerializer < ActiveModel::Serializer
  attributes :id, :name, :department_id, :documents_count, :used_storage
end

