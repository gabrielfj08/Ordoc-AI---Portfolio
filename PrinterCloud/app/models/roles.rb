module Roles
  ADMIN = 'Roles::Admin'
  ORGANIZATION_MANAGER = 'Roles::OrganizationManager'
  ORGANIZATION_MEMBER = 'Roles::OrganizationMember'
  DEPARTMENT_MEMBER = 'Roles::DepartmentMember'

  # TODO: ADD TESTS
  def self.map_params(params)
    type = params[:type]

    if type
      params.merge(type: ROLE_MAPPINGS[type])
    else
      params
    end
  end

  private

  ROLE_MAPPINGS = {
    Roles::Admin::SERIALIZED_TYPE => ADMIN,
    Roles::OrganizationManager::SERIALIZED_TYPE => ORGANIZATION_MANAGER,
    Roles::OrganizationMember::SERIALIZED_TYPE => ORGANIZATION_MEMBER,
    Roles::DepartmentMember::SERIALIZED_TYPE => DEPARTMENT_MEMBER,
    admin: ADMIN,
    organization_manager: ORGANIZATION_MANAGER,
    organization_member: ORGANIZATION_MEMBER,
    department_member: DEPARTMENT_MEMBER
  }
end
