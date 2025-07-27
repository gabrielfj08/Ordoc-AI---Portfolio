class Page < ApplicationRecord
  include AASM

  STATUSES = Hash(
    failed: -1,
    created: 0,
    enqueued: 1,
    processed: 2
  )

  belongs_to :document
  has_one_attached :file
  has_one :metric, class_name: 'PageMetric', foreign_key: 'page_id', dependent: :destroy

  validates :name, presence: true, uniqueness: { scope: :document }

  enum status: STATUSES
  aasm column: :status, enum: true do
    state :created, initial: true
    state :enqueued, :processed, :failed

    event :enqueue, after: :perform_async do
      transitions from: %i[created enqueued failed], to: :enqueued
    end

    event :process do
      transitions from: %i[enqueued failed], to: :processed
    end

    event :fail do
      transitions from: %i[enqueued failed], to: :failed
    end
  end

  def perform_async(queue_options)
    OcrPageWorker.set(queue_options).perform_async(id)
  end
end
