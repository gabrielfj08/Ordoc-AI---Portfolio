module PrinterAir
  class DirectoryInfo < ApplicationRecord
    include AASM
    include Authorizable

    belongs_to :directory, class_name: 'PrinterAir::Directory'
    belongs_to :created_by, class_name: 'PrinterCloud::User'

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
      PrinterAir::DirectoryInfoWorker.perform_async(id)
      true
    end
  end
end
