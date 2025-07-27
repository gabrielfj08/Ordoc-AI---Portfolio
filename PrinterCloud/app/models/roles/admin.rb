module Roles
  class Admin < Role
    SERIALIZED_TYPE = 'ADMIN'

    validates :user, uniqueness: true
  end
end
