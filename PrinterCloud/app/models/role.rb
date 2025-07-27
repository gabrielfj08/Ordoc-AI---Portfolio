class Role < ApplicationRecord
  belongs_to :user
  belongs_to :organization, optional: true
  belongs_to :department, optional: true

  validates :type, presence: true

  scope :filter_by_type, -> (type) { where(type: type) }
  scope :filter_by_user_id, -> (user_id) { where(user_id: user_id) }
  scope :filter_by_organization_id, -> (organization_id) { where(organization_id: organization_id) }
  scope :filter_by_department_id, -> (department_id) { where(department_id: department_id) }
  scope :admin, -> { where(type: Roles::ADMIN) }
  scope :organization_manager, -> { where(type: Roles::ORGANIZATION_MANAGER) }
  scope :organization_member, -> { where(type: Roles::ORGANIZATION_MEMBER) }
  scope :department_member, -> { where(type: Roles::DEPARTMENT_MEMBER) }

  before_destroy :destroy_shared_documents, if: -> { organization_id? }

  private

  def destroy_shared_documents
    return if user.roles.where(organization_id: organization_id).count > 1

    Permission.where(user: user).where.not(document_id: nil).map(&:document).each do |document|
      document.permissions.where(user: user).destroy_all if document.directory.department.organization_id == organization_id
    end
  end
end
