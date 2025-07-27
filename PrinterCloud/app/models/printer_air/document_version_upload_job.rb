module PrinterAir
  class DocumentVersionUploadJob < ApplicationRecord
    include AASM

    self.table_name = 'printer_air.document_version_upload_jobs'

    after_commit :run!, on: :create

    validates :s3_key, presence: true

    belongs_to :created_by, class_name: 'PrinterCloud::User'
    belongs_to :document, class_name: 'PrinterAir::Document'

    STATUSES = Hash(
      failed: -1,
      created: 0,
      running: 1,
      finished: 2
    )

    enum status: STATUSES
    aasm column: :status, enum: true do
      state :created, initial: true
      state :running
      state :finished, :failed

      event :run, after: :enqueue_job do
        transitions from: :created, to: :running
      end

      event :finish do
        transitions from: %i[running failed], to: :finished
      end

      event :fail do
        transitions from: %i[running failed], to: :failed
      end
    end

    def document_prn
      _env, organization_cnpj, path = s3_key.split('/', 3)
      "prn:printer_air:#{organization_cnpj}:#{path}"
    end

    private

    def enqueue_job
      PrinterAir::DocumentVersionUploadWorker.perform_async(id)
      true
    end
  end
end
