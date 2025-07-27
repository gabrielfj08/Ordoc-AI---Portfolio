module DirectorySerializer
  class RecycleBin < Base
    attributes :used_storage

    attribute(:ancestor_directory_tree) { object.ancestor_directory_tree }
    attribute(:trashed_by_name) { object.trashed_by&.name }
  end
end
