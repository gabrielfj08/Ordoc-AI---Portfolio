module PrinterFlow
  module External
    class Report < ApplicationRecord
      include AASM

      self.table_name = 'printer_flow.external_reports'

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
          transitions from: %i[created finished failed], to: :running
        end

        event :finish do
          transitions from: %i[running], to: :finished
        end

        event :fail do
          transitions from: %i[running failed], to: :failed
        end
      end

      belongs_to :external_requester, class_name: 'PrinterFlow::ExternalRequester'

      validates :external_requester, uniqueness: true
      validates :procedures_running_count, :procedures_started_count, :tasks_running_count, :signatures_pending_count,
                :shared_procedures_pending_count, presence: true

      private

      def enqueue_job
        ::PrinterFlow::External::ReportWorker.perform_async(id)
      end
    end
  end
end
