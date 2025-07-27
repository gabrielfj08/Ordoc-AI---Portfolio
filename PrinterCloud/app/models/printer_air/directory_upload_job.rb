module PrinterAir
  class DirectoryUploadJob < ApplicationRecord
    include AASM

    self.table_name = 'printer_air.document_upload_jobs'

    belongs_to :created_by, class_name: 'PrinterCloud::User'
    validates :s3_key, presence: true

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

    def directory_prn
      _env, organization_cnpj, path = s3_key.split('/', 3)
      "prn:printer_air:#{organization_cnpj}:#{path}/"
    end

    private

    def enqueue_job
      PrinterAir::DirectoryUploadWorker.perform_async(id)
      true
    end
  end
end
