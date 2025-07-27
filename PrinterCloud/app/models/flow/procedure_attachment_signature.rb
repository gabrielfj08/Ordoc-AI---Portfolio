module Flow
  class ProcedureAttachmentSignature < ApplicationRecord
    include AASM

    validates :procedure_attachment, uniqueness: { scope: :user }
    validates :signature, uniqueness: true, presence: true
    validates_associated :procedure_attachment
    belongs_to :procedure_attachment
    belongs_to :attachment, class_name: 'Flow::ProcedureAttachment', foreign_key: 'procedure_attachment_id'
    belongs_to :user

    scope :filter_by_department_id,   -> (department_id) { joins(procedure_attachment: { procedure: :department }).where(department: { id: department_id }) }
    scope :filter_by_organization_id, -> (organization_id) { joins(procedure_attachment: { procedure: { department: :organization } }).where(organization: { id: organization_id }) }

    after_create :sign_attachment

    STATUSES = Hash(
      :failed   => -1,
      :sleeping =>  0,
      :running  =>  1,
      :signed   =>  2,
    )

    enum status: STATUSES
    aasm column: :status, enum: true do
      state :sleeping, initial: true
      state :running, :signed, :failed

      event :run, after: :perform_async do
        transitions from: :sleeping, to: :running
      end

      event :sign do
        transitions from: [:running, :failed], to: :signed
      end

      event :fail do
        transitions from: [:sleeping, :running], to: :failed
      end
    end

    def sign_attachment
      self.run!
    end

    def perform_async
      FlowProcedureSignatureWorker.perform_async(self.id)
    end
  end
end
