module Flow
  class ProcedurePdf < ApplicationRecord
    include AASM

    STATUSES = Hash(
      :failed => -1,
      :created => 0,
      :enqueued => 1,
      :processed => 2,
    )

    enum status: STATUSES
    aasm column: :status, enum: true do
      state :created, initial: true
      state :enqueued, :processed, :failed

      event :enqueue, after: :enqueue_procedure_pdf do 
        transitions from: :created, to: :enqueued
      end

      event :process do
        transitions from: [:enqueued, :failed], to: :processed
      end

      event :fail do
        transitions from: [:enqueued, :failed], to: :failed
      end
    end

    after_create :enqueue!

    validates :name, presence: true

    belongs_to :procedure

    has_one_attached :file

    private
    
    def enqueue_procedure_pdf
      ProcedurePdfWorker.perform_async(self.id)
    end
  end
end
