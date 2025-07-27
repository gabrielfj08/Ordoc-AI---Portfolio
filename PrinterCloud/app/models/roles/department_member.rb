module Roles
  class DepartmentMember < Role
    SERIALIZED_TYPE = 'DEPARTMENT_MEMBER'

    belongs_to :department

    validates :user_id, uniqueness: { scope: %i[department_id type], message: I18n.t('activerecord.errors.messages.already_added')  }
    before_validation :ensure_user_is_organization_member
    after_create :add_user_to_group
    before_destroy :remove_user_from_group

    private

    def ensure_user_is_organization_member
      role = user.roles.find_by(type: Roles::ORGANIZATION_MEMBER, organization_id: department.organization_id)   
      unless role
        add_user_as_organization_member
      end
    end

    def add_user_as_organization_member
      Role.create!(type: Roles::ORGANIZATION_MEMBER, organization_id: department.organization_id, user_id: user.id)
    end

    def add_user_to_group
      department.user_groups.first.users << user if department.user_groups.count > 0
    end

    def remove_user_from_group
      group = user.user_groups.find_by(department: department)
      group.users.delete(user) unless group.nil?
    end
  end
end
