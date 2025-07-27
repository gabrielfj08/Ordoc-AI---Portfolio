class BatchOperation < ApplicationRecord
  include AASM

  RECORD_TYPES = ['Document', 'Directory']
  ACTIONS = ['destroy', 'move', 'trash', 'share']

  validates :record_type, :action, :ids, presence: true
  validates :record_type, inclusion: { in: RECORD_TYPES }
  validates :action, inclusion: { in: ACTIONS }

  belongs_to :created_by, class_name: 'User', foreign_key: 'created_by_id', optional: true

  scope :filter_by_created_by_id, -> (user_id) { where(created_by_id: user_id) }

  after_create do
    run!
  end

  STATUSES = Hash(
    :failed   => -1,
    :sleeping =>  0,
    :running  =>  1,
    :finished =>  2,
  )

  enum status: STATUSES
  aasm column: :status, enum: true do
    state :sleeping, initial: true
    state :running, :finished, :failed

    event :run, after: :perform_async do
      transitions from: :sleeping, to: :running
    end

    event :finish do
      transitions from: [:running, :failed], to: :finished
    end

    event :fail do
      transitions from: [:sleeping, :running], to: :failed
    end
  end

  def executor
    @batch_executor ||= Batches::ExecutorFactory.new(self).executor
  end

  def perform
    executor.execute
  end

  def perform_async
    BatchOperationsWorker.perform_async(self.id)
  end
end
