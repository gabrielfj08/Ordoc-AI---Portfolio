module PrinterAir
  class DownloadJob < ApplicationRecord
    require 'securerandom'
    include AASM

    self.table_name = 'printer_air.download_jobs'

    before_create :generate_uuid
    after_commit :run!, on: :create

    belongs_to :created_by, class_name: 'PrinterCloud::User'

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

    def download_link
      return nil if s3_key.nil?

      Aws::S3::Resource.new(credentials: PrinterCloud::Aws.credentials)
                       .bucket('printer-air-download')
                       .object(s3_key)
                       .presigned_url(:get)
    end

    private

    def generate_uuid
      self.uuid = SecureRandom.uuid
    end

    def enqueue_job
      PrinterAir::DownloadWorker.perform_async(id)
      true
    end
  end
end
