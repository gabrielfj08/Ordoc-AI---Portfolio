module PrinterDriver
  class DocumentUploadJob < ApplicationRecord
    include AASM

    belongs_to :organization

    validates :bucket, :key, presence: true

    enum service: %i[sender driver]

    STATUSES = Hash(
      invalidated: -2,
      failed: -1,
      sleeping: 0,
      running: 1,
      finished: 2
    )

    enum status: STATUSES
    aasm column: :status, enum: true do
      state :sleeping, initial: true
      state :running
      state :finished, :failed, :invalidated

      event :run, after: :enqueue_job do
        transitions from: :sleeping, to: :running
      end

      event :finish do
        transitions from: :running, to: :finished
      end

      event :invalidate do
        transitions from: :running, to: :invalidated
      end
    end

    private

    def enqueue_job
      ::PrinterDriver::DocumentUploadWorker.perform_async(id)
      true
    end
  end
end
