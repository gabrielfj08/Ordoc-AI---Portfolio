module PrinterAir
  class DocumentCopy < ApplicationRecord
    include AASM

    after_commit :run!, on: :create

    validates :created_by_id, presence: true
    belongs_to :document, class_name: 'PrinterAir::Document'
    belongs_to :created_by, class_name: 'PrinterCloud::User'

    STATUSES = Hash(
      failed: -1,
      created: 0,
      running: 1,
      finished: 2
    )

    enum status: STATUSES
    aasm column: :status, enum: true do
      state :created, initial: true
      state :running
      state :finished, :failed

      event :run, after: :enqueue_job do
        transitions from: :created, to: :running
      end

      event :finish do
        transitions from: %i[running failed], to: :finished
      end

      event :fail do
        transitions from: %i[running failed], to: :failed
      end
    end

    private

    def enqueue_job
      PrinterAir::DocumentCopyWorker.perform_async(id)
      true
    end
  end
end
