module Flow
  class Task < ApplicationRecord
    include AASM
    include Archiveable
    include Discard::Model
    include Filterable
    include Orderable

    self.discard_column = :deleted_at

    STATUSES = Hash(
      draft: 0,
      started: 1,
      review: 2,
      finished: 3
    )

    enum status: STATUSES
    aasm column: :status, enum: true do
      state :draft, initial: true
      state :started, :review, :finished

      event :start do
        transitions from: %i[draft started review], to: :started
      end

      event :review do
        transitions from: %i[started review], to: :review
      end

      event :finish, before: :task_must_not_have_pending_signatures do
        transitions from: %i[started review finished], to: :finished
      end
    end

    validates :name, :description, :status, presence: true

    before_create :procedure_must_not_be_frozen

    belongs_to :procedure, class_name: 'Flow::Procedure'
    delegate :department, to: :procedure
    belongs_to :assignable, polymorphic: true, optional: true

    has_many :attachments, class_name: 'Flow::TaskAttachment', dependent: :destroy
    has_many :signatures, through: :attachments, source: :task_attachment_signatures
    has_one :task_assignment, dependent: :destroy
    has_one :assignee, through: :task_assignment, source: :user
    has_many :users_tasks, class_name: 'Flow::UsersTask'
    has_many :histories, as: :trackable
    has_many :task_comments, class_name: 'Flow::TaskComment', dependent: :destroy
    has_one :user_group, through: :task_assignment
    has_one :group_assignee, through: :task_assignment, source: :user_group
    has_one :refusing_note, class_name: 'Flow::RefusingNote'

    scope :filter_by_department_member_id,    lambda { |department_member_id|
                                                joins(procedure: { department: :roles }).where(roles: { user_id: department_member_id })
                                              }
    scope :filter_by_organization_manager_id, lambda { |organization_manager_id|
                                                joins(procedure: { department: { organization: :roles } }).where(roles: { user_id: organization_manager_id, type: Roles::ORGANIZATION_MANAGER })
                                              }
    scope :filter_by_organization_member_id,  lambda { |organization_member_id|
                                                joins(procedure: { department: { organization: :roles } }).where(roles: { user_id: organization_member_id, type: Roles::ORGANIZATION_MEMBER })
                                              }
    scope :filter_by_assignee_id,             lambda { |assignee_id|
                                                joins(task_assignment: :user).where(user: { id: assignee_id })
                                              }
    scope :filter_by_user_group_id,           lambda { |user_group_id|
                                                joins(:task_assignment).where(task_assignment: { user_group_id: user_group_id })
                                              }
    scope :filter_by_group_assignee_id,       lambda { |user_id|
                                                joins(user_group: :users).where(user_group: { users: user_id })
                                              }
    scope :filter_by_procedure_id,            ->(procedure_id) { where(procedure_id: procedure_id) }
    scope :filter_by_department_id,           lambda           { |department_id|
                                                joins(:procedure).where(procedure: { department_id: department_id })
                                              }
    scope :filter_by_created_by_id,           lambda           { |created_by_id|
                                                joins(:histories).where(histories: { action: :created, user_id: created_by_id })
                                              }
    scope :filter_by_accepted_by_id,          lambda { |accepted_by_id|
                                                joins(:histories).where(histories: { action: :accepted, user_id: accepted_by_id })
                                              }
    scope :filter_by_refused_by_id,           lambda { |_refused_by_id|
                                                joins(:histories).where(histories: { action: :refused, user_id: refuser_by_id })
                                              }
    scope :filter_by_assigned_by_id,          lambda { |assigned_by_id|
                                                joins(:histories).where(histories: { action: :assigned, user_id: assigned_by_id })
                                              }
    scope :filter_by_assigned_user_group_id,  lambda  { |assigned_user_group_id|
                                                where(assignable_type: 'Flow::UserGroup', assignable_id: assigned_user_group_id)
                                              }
    scope :filter_by_assigned_department_id,  lambda  { |assigned_department_id|
                                                where(assignable_type: 'Department', assignable_id: assigned_department_id)
                                              }
    scope :filter_by_assigned_user_id,        lambda { |assigned_user_id|
                                                where(assignable_type: 'Department', assignable_id: assigned_user_id)
                                              }
    scope :filter_by_organization_id,         lambda { |organization_id|
                                                joins(procedure: { department: :organization }).where(organization: { id: organization_id })
                                              }
    scope :filter_by_statuses,                ->(statuses) { where(status: statuses) }

    scope :search_by, ->(query) { search_by_name(query).or(search_by_description(query)) if query.present? }
    scope :search_by_name, ->(name) { where(Flow::Task.arel_table[:name].matches("%#{name}%")) }
    scope :search_by_description, lambda { |description|
                                    where(Flow::Task.arel_table[:description].matches("%#{description}%"))
                                  }

    after_discard do
      attachments.discard_all
    end

    def task_acceptable_by_user?(user)
      assignable == user || assignable&.users&.include?(user)
    end

    def accepted_by
      User.where(id: histories.where(action: :accepted).pluck(:user_id)).first
    end

    def refused_by
      User.where(id: histories.where(action: :refused).pluck(:user_id)).first
    end

    def created_by
      User.where(id: histories.where(action: :created).pluck(:user_id)).first
    end

    def assigned_by
      User.where(id: histories.where(action: :assigned).pluck(:user_id)).first
    end

    def assign!(user, assignable)
      ActiveRecord::Base.transaction do
        task_history = histories.new(user: user, attributes_before: attributes, action: :assigned)
        update!(status: :assigned, assignable: assignable)
        task_history.attributes_after = attributes
        task_history.save!
      end
    end

    def closed?
      finished? || archived?
    end

    private

    def task_must_not_have_pending_signatures
      signatures.each do |signature|
        raise Error::PendingSignaturesError if signature.requested?
      end
    end

    def procedure_must_not_be_frozen
      raise Error::FrozenProcedureError if procedure.frozen?
    end
  end
end
