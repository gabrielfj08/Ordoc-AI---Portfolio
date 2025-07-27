class ShareableLink < ApplicationRecord
  include AASM

  belongs_to :document

  after_create do
    enqueue!
  end

  STATUSES = Hash(
    :failed => -1,
    :created => 0,
    :enqueued => 1,
    :finished => 2,
  )

  enum status: STATUSES
  aasm column: :status, enum: true do
    state :created, initial: true
    state :enqueued, :finished, :failed

    event :enqueue, after: :enqueue_shareable_link do 
      transitions from: :created, to: :enqueued
    end

    event :finish do
      transitions from: [:enqueued, :failed], to: :finished
    end

    event :fail do
      transitions from: :enqueued, to: :failed
    end
  end

  def perform
    self.shareable_link = Services::ShareableLink.new(self).create_shareable_link(self.expires_in)
  end

  def enqueue_shareable_link
    ShareableLinkWorker.perform_async(self.id, document.id)
  end
end
