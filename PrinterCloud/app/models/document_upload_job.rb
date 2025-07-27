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
    completed: 2
  )

  enum status: STATUSES
  aasm column: :status, enum: true do
    state :sleeping, initial: true
    state :running
    state :completed, :failed, :invalidated

    event :run, after: :enqueue_job do
      transitions from: :sleeping, to: :running
    end

    event :complete do
      transitions from: :running, to: :completed
    end

    event :invalidate do
      transitions from: :running, to: :invalidated
    end
  end

  private

  def enqueue_job
    DocumentUploadWorker.perform_async(id)
  end
end
