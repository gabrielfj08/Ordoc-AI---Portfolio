module Flow
  class TaskAttachment < ApplicationRecord
    include Discard::Model
    include Filterable
    include Orderable

    self.discard_column = :deleted_at

    validates :name, presence: true
    before_destroy :must_not_be_requested_or_signed

    before_discard do
      must_not_be_requested_or_signed
    end

    has_one_attached :file
    has_one_attached :original_file
    has_many :histories, as: :trackable
    has_many :task_attachment_signatures
    validates_length_of :task_attachment_signatures, maximum: 20

    belongs_to :task

    scope :filter_by_department_id,   -> (department_id) { joins(task: :procedure).where(procedure: { department_id: department_id }) }
    scope :filter_by_organization_id, -> (organization_id) { joins(task: { procedure: { department: :organization } }).where(organization: { id: organization_id }) }
    scope :filter_by_created_by_id,   -> (created_by_id) { joins(:histories).where(histories: { action: :created, user_id: created_by_id }) }
    scope :filter_by_task_id,         -> (task_id) { where(task_id: task_id) }
    scope :filter_by_procedure_id,    -> (procedure_id) { joins(task: :procedure).where(task: { procedure_id: procedure_id }) }
    scope :filter_by_assignee_id,     -> (user_id) { joins(task: :task_assignment).where(task_assignment: { user_id: user_id}) }
    scope :signed,                    -> { joins(:task_attachment_signatures).where(task_attachment_signatures: { status: :signed }) }

    scope :on_draft_task,             -> { joins(:task).where(task: { status: :draft }) }
    scope :on_accepted_task,          -> (user_id) { joins(task: :task_assignment).where(task_assignment: { status: 1, user_id: user_id }) }

    def url
      Rails.application.routes.url_helpers.rails_blob_path(self.file.attachment, only_path: true) if self.file.attached?
    end

    private

    def must_not_be_requested_or_signed
      raise Error::CannotDeleteAttachmentError if task_attachment_signatures.present?
    end
  end
end
