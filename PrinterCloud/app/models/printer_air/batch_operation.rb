module PrinterAir
  class BatchOperation < ApplicationRecord
    include AASM

    RECORD_TYPES = %w[PrinterAir::Document PrinterAir::Directory]
    ACTIONS = %w[destroy move move_and_keep move_and_replace move_and_merge ocr share trash restore_and_keep
                 restore_and_merge restore_and_replace]

    validates :record_type, :action, :ids, presence: true
    validates :record_type, inclusion: { in: RECORD_TYPES }
    validates :action, inclusion: { in: ACTIONS }

    belongs_to :created_by, class_name: 'PrinterCloud::User', foreign_key: 'created_by_id', optional: true

    scope :filter_by_created_by_id, ->(user_id) { where(created_by_id: user_id) }

    after_commit :run!, on: :create

    STATUSES = Hash(
      failed: -1,
      created: 0,
      running: 1,
      finished: 2
    )

    enum status: STATUSES
    aasm column: :status, enum: true do
      state :created, initial: true
      state :running, :finished, :failed

      event :run, after: :enqueue_job do
        transitions from: :created, to: :running
      end

      event :finish do
        transitions from: %i[running failed], to: :finished
      end

      event :fail do
        transitions from: %i[created running failed], to: :failed
      end
    end

    def executor
      @batch_executor ||= ::Batches::PrinterAir::ExecutorFactory.new(self).executor
    end

    def perform
      executor.execute
    end

    def enqueue_job
      PrinterAir::BatchOperationsWorker.perform_async(id)
      true
    end
  end
end
