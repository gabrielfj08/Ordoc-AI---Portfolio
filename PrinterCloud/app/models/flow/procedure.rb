module Flow
  class Procedure < ApplicationRecord
    include AASM
    include Archiveable
    include Discard::Model
    include Filterable
    include Orderable
    include Searchable
    include Tree

    self.discard_column = :deleted_at
    self.searchable_fields = [:internal_process_number, :name]
    
    STATUSES = Hash(
      'draft'      =>  0,
      'started'    =>  1,
      'finished'   =>  2,
    )

    enum status: STATUSES
    aasm column: :status, enum: true do
      state :draft, initial: true
      state :started
      state :finished

      event :start do
        transitions from: [:draft, :started], to: :started, guard: :can_change_status?
      end

      event :finish do
        transitions from: [:started, :finished], to: :finished, guards: [:closed_tasks?, :can_change_status?]
      end
    end

    def aasm_event_failed(event_name, old_state_name)
      raise Error::InvalidTransitionError
    end

    before_validation :generate_internal_process_number, on: :create
    before_archive :ensure_tasks_are_closed, :record_must_not_be_frozen

    belongs_to :department
    delegate :organization, to: :department

    belongs_to :procedure_template
    belongs_to :creator, class_name: 'User', foreign_key: 'created_by_id', optional: true
    alias_method :created_by, :creator

    has_many :histories, as: :trackable
    has_many :tasks, class_name: 'Flow::Task', dependent: :destroy

    has_many :procedure_requesters, dependent: :destroy
    has_many :requesters, through: :procedure_requesters
    has_many :archiving_notes, class_name: 'Flow::ArchivingNote'

    has_many :procedure_beneficiaries, dependent: :destroy
    has_many :beneficiaries, through: :procedure_beneficiaries
    has_many :procedure_pdfs, dependent: :destroy

    has_many :attachments, class_name: 'Flow::ProcedureAttachment', dependent: :destroy
    has_many :task_attachments, through: :tasks, source: :attachments

    validates :name, :description, :status, presence: true
    validates :creator, presence: true, on: :create
    validates :internal_process_number, presence: true, procedure_number: true
    validate :unique_internal_process_number, on: :create

    scope :filter_by_assigned_user_group_id,  -> (user_group_id) { joins(tasks: :task_assignment).where(task_assignment: { user_group_id: user_group_id }) }
    scope :filter_by_organization_id,         -> (organization_id) { joins(:department).where(department: { organization_id: organization_id }) }
    scope :filter_by_created_by_id,           -> (created_by_id) { where(created_by_id: created_by_id) }
    scope :filter_by_department_id,           -> (department_id) { where(department_id: department_id) }
    scope :filter_by_signer_id,               -> (user_id) { joins(tasks: { attachments: :task_attachment_signatures }).where(task_attachment_signatures: { user_id: user_id }) } 
    scope :filter_by_organization_manager_id, -> (organization_manager_id) { joins(department: { organization: :roles }).where(roles: { type: Roles::ORGANIZATION_MANAGER, user_id: organization_manager_id }) }
    scope :filter_by_organization_member_id,  -> (organization_member_id) { joins(department:{ organization: :roles }).where(roles: { type: Roles::ORGANIZATION_MEMBER, user_id: organization_member_id }) }
    scope :filter_by_department_member_id,    -> (department_member_id) { joins(department: :roles).where(roles: { user_id: department_member_id }) }
    scope :filter_by_task_assignee_id,        -> (task_assignee_id) { joins(tasks: { task_assignment: :user }).where(user: { id: task_assignee_id }) }
    scope :filter_by_parent_id,               -> (parent_id) { where(parent_id: parent_id) }
    scope :filter_by_statuses,                -> (statuses)  { where(status: statuses & Flow::Procedure::STATUSES.keys) }
    scope :filter_by_procedure_template_id,   -> (procedure_template_id) { where(procedure_template_id: procedure_template_id) }
    scope :visible,                           -> { where(public: true) }
    scope :not_visible,                       -> { where(public: false) }
    scope :search_by_internal_process_number, -> (query) { where(internal_process_number: query) }
    scope :search_by_name,                    -> (query) { where(Flow::Procedure.arel_table[:name].matches("%#{query}%")) }

    scope :draft,                             -> { where(status: :draft) }
    scope :frozen,                            -> { where(status: :finished).or(where.not(archived_at: nil)) }
    scope :not_frozen,                        -> { where.not(status: :finished).where(archived_at: nil) }

    after_discard do
      tasks.discard_all
      attachments.discard_all
    end

    after_undiscard do
      tasks.undiscard_all
      attachments.undiscard_all
    end

    def closed_tasks?
      self.tasks.kept.all? do |task|
        task.closed?
      end
    end

    def can_change_status?
      self.archived? == false
    end

    def ensure_tasks_are_closed
      raise Error::InvalidTransitionError unless closed_tasks?
    end

    def frozen?
      self.archived? || self.finished?
    end

    def viewers
      task_assignees = User.joins(task_assignments: { task: :procedure }).where(task: { procedure_id: self.id })
      group_assignees = User.joins(user_groups: { task_assignments: { task: :procedure }}).where(user_groups: { task_assignments: { tasks: { procedure_id: self.id } } })
      attachment_signer = User.joins(task_attachment_signatures: { task_attachment: { task: :procedure } }).where(task: { procedure_id: self.id })
      viewers = ([creator] + task_assignees + group_assignees + attachment_signer).uniq
    end

    private

    def generate_internal_process_number
      procedure = self.organization.procedures.last

      procedure.nil? ? current_process_number = 0 : current_process_number = procedure.internal_process_number.split.first.to_i

      self.internal_process_number = "#{current_process_number+1}/#{Time.now.year}"
    end

    def unique_internal_process_number
      return unless self.organization.procedures.pluck(:internal_process_number).include? self.internal_process_number

      errors.add(:internal_process_number, :taken)
    end

    def record_must_not_be_frozen
      raise Error::RecordFrozenError if frozen?
    end
  end
end
