module Flow
  class TaskAssignment < ApplicationRecord
    include Discard::Model
    include Filterable
    include AASM

    STATUSES = Hash(
      :created    =>  0,
      :accepted   =>  1,
      :refused    =>  2
    )

    enum status: STATUSES
    aasm column: :status, enum: true do
      state :created, initial: true
      state :accepted, :refused

      event :accept, before_enter: [:user_must_be_task_assignee], after: [:review_task] do
        transitions from: :created, to: :accepted
      end

      event :refuse, before_enter: [:user_must_be_task_assignee], after: [:refuse_task] do
        transitions from: :created, to: :refused
      end
    end

    belongs_to :task
    belongs_to :user, optional: true
    belongs_to :user_group, optional: true
    has_many :notes, class_name: 'Flow::TaskAssignmentNote'

    validates :user, presence: true, unless: -> { user_group.present? }
    validates :user_group, presence: true, unless: -> { user.present? }
    validate :procedure_must_have_requester_or_beneficiary
    before_save :start_procedure
    before_save :start_task

    self.discard_column = :deleted_at

    scope :filter_by_procedure_id, -> (procedure_id) { joins(:task).where( task: {procedure_id: procedure_id }) }

    def start_procedure
      task.procedure.start! if task.procedure.draft?
    end

    def start_task
      task.start! if task.draft? #TODO ASSGINEES CANNOT BE CHANGED AFTER SETTED
    end

    def review_task
      task.review!
    end

    def refuse_task
      task.finish!
    end

    def aasm_event_failed(event_name, old_state_name)
      raise Error::InvalidTransitionError
    end

    private

    def procedure_must_have_requester_or_beneficiary
      raise Error::InvalidTransitionError unless task.procedure.requesters.count > 0 || task.procedure.beneficiaries.count > 0
    end

    def user_must_be_task_assignee
      raise Error::UserMustBeTaskAssigneeError unless task.assignee.user == user
    end
  end
end
