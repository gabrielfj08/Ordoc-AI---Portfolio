require 'aws-sdk-s3'

class DownloadLink < ApplicationRecord
  belongs_to :user

  validates :name, :targets, presence: true
  before_validation :generate_job

  def detailed_status
    Sidekiq::Status.get_all(jid)
  end

  def download_link
    return nil if key.nil?

    Aws::S3::Resource.new(credentials: PrinterCloud::Aws.credentials)
                     .bucket('printer-cloud-download')
                     .object(key)
                     .presigned_url(:get)
  end

  private

  def generate_job
    enqueue_job
    errors.add(:jid, :not_enqueued) unless jid?
  end
  
  def enqueue_job
    self.jid = DownloadLinkGeneratorWorker.perform_async(targets) if user_id? && name? && targets? && !jid?
  end
end

