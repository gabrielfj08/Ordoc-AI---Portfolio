class DirectoryInfo < ApplicationRecord
  include AASM

  belongs_to :directory

  after_create :enqueue!

  STATUSES = Hash(
    :failed     => -1,
    :created    =>  0,
    :enqueued   =>  1,
    :processed  =>  2,
  )

  enum status: STATUSES
  aasm column: :status, enum: true do
    state :created, initial: true
    state :enqueued, :processed, :failed

    event :enqueue, after: :enqueue_directory_info do
      transitions from: [:created, :failed], to: :enqueued
    end

    event :process do
      transitions from: [:enqueued], to: :processed
    end

    event :fail do
      transitions from: [:enqueued], to: :failed
    end
  end

  private

  def enqueue_directory_info
    DirectoryInfoWorker.perform_async(self.id)
  end
end
