module DepartmentSerializer
  class List < Base
    attribute(:directories_count) { object.directories.not_trashed.kept.count }
    attribute(:users_count) { object.users.count }
  end
end
