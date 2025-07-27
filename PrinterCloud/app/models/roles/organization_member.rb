module Roles
  class OrganizationMember < Role
    include Roles::OrganizationRoleable

    SERIALIZED_TYPE = 'ORGANIZATION_MEMBER'

    before_destroy :destroy_department_members

    private

    def destroy_department_members
      departments_ids = Department.where(organization_id: organization_id).pluck(:id)
      Role.where(department: departments_ids, user: user, type: Roles::DEPARTMENT_MEMBER).destroy_all
    end
  end
end
