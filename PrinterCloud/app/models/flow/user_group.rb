module Flow
  class UserGroup < ApplicationRecord
    include AASM
    include Activable
    include Discard::Model
    include Filterable
    include Orderable

    self.discard_column = :deleted_at

    belongs_to :organization
    belongs_to :department, optional: true
    has_and_belongs_to_many :users
    has_many :task_assignments

    scope :filter_by_user_id, -> (user_id) { joins(:users).where(users: { id: user_id }) }
    scope :filter_by_organization_id, -> (organization_id) { where(organization_id: organization_id) }
    scope :filter_by_name, -> (name) { where(name: name) }
    scope :filter_by_status, -> (status) { where(status: status) }
    scope :search_by, -> (query) { search_by_name(query) if query.present? }
    scope :search_by_name, -> (name) { where(Flow::UserGroup.arel_table[:name].matches("%#{name}%")) }

    validates :name, presence: true
    validates :name, uniqueness: { scope: :organization }

    before_discard :user_group_must_not_be_in_task

    def users_count
      users.count
    end

    def user_group_must_not_be_in_task
      raise Error::UserGroupMustNotBeInTaskError if task_assignments.count > 0
    end
  end
end
