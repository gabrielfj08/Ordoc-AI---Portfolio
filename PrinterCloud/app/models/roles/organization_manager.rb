module Roles
  class OrganizationManager < Role
    include Roles::OrganizationRoleable

    SERIALIZED_TYPE = 'ORGANIZATION_MANAGER'
  end
end
