module PrinterFlow
  class ProcedureReport < ApplicationRecord
    self.table_name = 'printer_flow.procedure_reports'
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

      event :finish do
        transitions from: %i[running], to: :finished
      end

      event :fail do
        transitions from: %i[running failed], to: :failed
      end
    end

    after_commit :run!, on: :create
    before_create :set_procedure_status

    belongs_to :procedure, class_name: 'PrinterFlow::Procedure'
    belongs_to :created_by, class_name: 'PrinterCloud::User'
    belongs_to :document, class_name: 'PrinterAir::Document', optional: true

    scope :filter_by_status, lambda { |status|
                               where(status: status.map(&:to_sym) & STATUSES.keys)
                             }

    private

    def set_procedure_status
      self.procedure_status = procedure.status
    end

    def enqueue_job
      ::PrinterFlow::ProcedureReportWorker.perform_async(id)
      true
    end
  end
end
