class Department < ApplicationRecord
  include Discard::Model
  include Filterable
  include Orderable

  self.discard_column = :deleted_at

  validates :name, :description, :organization, presence: true
  after_create :create_user_group

  belongs_to :organization
  has_many :directories, dependent: :destroy
  has_many :documents
  has_many :roles, dependent: :destroy
  has_many :users, through: :roles
  has_many :procedures, class_name: 'Flow::Procedure', dependent: :destroy
  has_many :directory_uploads, dependent: :destroy
  has_many :user_groups, class_name: 'Flow::UserGroup', dependent: :destroy

  scope :filter_by_name, -> (name) { where(Department.kept.arel_table[:name].matches("%#{name}%")) }

  scope :filter_by_organization_id, -> (organization_id) { where(organization_id: organization_id) }
  scope :filter_by_role_member, -> (user_id) { joins(:roles).where(roles: { type: Roles::DEPARTMENT_MEMBER, user_id: user_id }) }
  scope :filter_by_department_member_id, -> (department_member_id) { joins(:roles).where(roles: { type: Roles::DEPARTMENT_MEMBER, user_id: department_member_id }) }
  scope :filter_by_organization_manager_id, -> (user_id) { joins(organization: :roles).where('roles.user_id = ?', user_id).where(roles: {type: Roles::ORGANIZATION_MANAGER}) }
  scope :active, -> { joins(:organization).where(organization: { status: :active }) }
  scope :inactive, -> { joins(:organization).where(organization: { status: :inactive }) }

  after_discard do
    roles.destroy_all
    directories.discard_all
    procedures.discard_all
    user_groups.discard_all
  end

  after_undiscard do
    directories.undiscard_all
    procedures.undiscard_all
    user_groups.undiscard_all
  end

  def active?
    organization.active?
  end

  def members
    User.kept.joins(:roles).where(roles: { department_id: id, type: Roles::DEPARTMENT_MEMBER })
  end

  def children_directories
    directories.where(department_id: self.id, parent_directory_id: nil)
  end

  private

  def create_user_group
    user_groups.create!(name: "Departamento #{self.name}", organization_id: self.organization_id)
  end
end
