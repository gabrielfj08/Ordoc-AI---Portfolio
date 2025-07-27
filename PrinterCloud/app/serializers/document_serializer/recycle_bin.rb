module DocumentSerializer
  class RecycleBin < Base
    attribute(:permissions) { object.permissions.kept }
    attribute(:trashed_by_name) { object.trashed_by&.name }
  end
end
