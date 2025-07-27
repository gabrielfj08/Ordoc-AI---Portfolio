module DirectoryInfoSerializer
  class Base < ActiveModel::Serializer
    include ActionView::Helpers::NumberHelper

    attributes :id, :status, :total_size, :total_directories_count, :total_documents_count, :directory_id, :created_by_id,
               :created_at, :updated_at

    attribute(:total_size) { number_to_human_size(object.total_size) }
  end
end
