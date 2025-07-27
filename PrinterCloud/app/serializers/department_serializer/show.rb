module DepartmentSerializer
  class Show < Base
    has_many :users, serializer: UserSerializer::Base
  end
end
