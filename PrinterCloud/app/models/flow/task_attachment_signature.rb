module Flow
	class TaskAttachmentSignature < ApplicationRecord
    include AASM
    include Filterable

		validates :task_attachment, uniqueness: { scope: :user }
    validates_associated :task_attachment
    validates :signature, uniqueness: { allow_nil: true }
    belongs_to :task_attachment
    belongs_to :attachment, class_name: 'Flow::TaskAttachment', foreign_key: 'task_attachment_id'
    belongs_to :user
    has_many :histories, as: :trackable

    scope :filter_by_organization_id,  -> (organization_id) { joins(task_attachment: { task: { procedure: { department: :organization } } }).where(organization: { id: organization_id }) }
    scope :filter_by_department_id,    -> (department_id) { joins(task_attachment: { task: { procedure: :department } }).where(department: { id: department_id })	}
    scope :filter_by_procedure_id,     -> (procedure_id) { joins(task_attachment: :task).where(task: { procedure_id: procedure_id }) }
    scope :filter_by_task_id,          -> (task_id) { joins(task_attachment: :task).where(task_attachment: { task_id: task_id } ) }
    scope :filter_by_created_by_id,    -> (user_id) { joins(:histories).where(histories: { action: :created, user_id: user_id }) }
    scope :filter_by_user_id,          -> (user_id) { where(user_id: user_id) }
    scope :filter_by_status,           -> (status)  { where(status: (status)) }

    STATUSES = Hash(
      :failed    => -1,
      :requested =>  0,
      :running   =>  1,
      :signed    =>  2,
      :refused   =>  3
    )

    enum status: STATUSES
    aasm column: :status, enum: true do
      state :requested, initial: true
      state :running, :signed, :refused, :failed

      event :run, after: :perform_async do
        transitions from: :requested, to: :running
      end

      event :sign do
        transitions from: [:running, :failed], to: :signed
      end

      event :refuse do
        transitions from: [:requested], to: :refused
      end

      event :fail do
        transitions from: [:requested, :running, :fail], to: :failed
      end
    end

    private

    def created_by
      User.where(id: histories.where(action: :created).pluck(:user_id)).first
    end

    def perform_async
      FlowTaskSignatureWorker.perform_async(self.id)
    end
  end
end
