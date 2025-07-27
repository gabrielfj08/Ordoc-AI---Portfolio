module PrinterFlow
  module External
    class ProcedureReport < ApplicationRecord
      self.table_name = 'printer_flow.external_procedure_reports'
      self.per_page = 10

      include AASM
      include Orderable
      include Filterable

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
          transitions from: %i[created], to: :running
        end

        event :finish, before: :ensure_document_is_present do
          transitions from: %i[running], to: :finished
        end

        event :fail do
          transitions from: %i[running failed], to: :failed
        end
      end

      after_commit :run!, on: :create

      before_create :get_procedure_status

      belongs_to :procedure, class_name: 'PrinterFlow::Procedure'
      belongs_to :document, class_name: 'PrinterAir::Document', optional: true, dependent: :destroy

      private

      def get_procedure_status
        self.procedure_status = procedure.status
      end

      def ensure_document_is_present
        raise Error::DocumentNotAttachedError unless document.present?
      end

      def enqueue_job
        ::PrinterFlow::External::ProcedureReportWorker.perform_async(id)
        true
      end
    end
  end
end