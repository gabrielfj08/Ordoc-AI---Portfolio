class DestroyShareableLink < ApplicationRecord
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

    event :enqueue, after: :enqueue_destroy_shareable_link do 
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
    Services::ShareableLink.new(self).destroy_permanent_link
  end

  def enqueue_destroy_shareable_link
    DestroyShareableLinkWorker.perform_async(self.id)
  end
end
