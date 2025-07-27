module DirectorySerializer
  class List < Base
    attributes :documents_count, :documents_count_with_subdirectories, :path

    attribute(:children_directories_count) { object.children_directories.not_trashed.kept.count }
  end
end
