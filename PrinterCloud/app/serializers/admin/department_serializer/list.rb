module Admin
  module DepartmentSerializer
    class List < Base
      attribute(:users_count) { object.users.count }
    end
  end
end
