module PrinterFlow
  class RequesterInfo < ApplicationRecord
    include AASM

    belongs_to :requester, class_name: 'PrinterFlow::Requester'
    belongs_to :created_by, class_name: 'PrinterCloud::User', optional: true

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

      event :run, after: :enqueue_directory_info do
        transitions from: %i[created failed], to: :running
      end

      event :finish do
        transitions from: %i[running failed], to: :finished
      end

      event :fail do
        transitions from: %i[running failed], to: :failed
      end
    end

    private

    def enqueue_directory_info
      PrinterFlow::RequesterInfoWorker.perform_async(id)
      true
    end
  end
end
