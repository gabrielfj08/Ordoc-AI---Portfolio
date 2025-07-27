module V3
  module UserSerializer
    class List < Base
      attributes :organizations_count, :user_groups_count
    end
  end
end
