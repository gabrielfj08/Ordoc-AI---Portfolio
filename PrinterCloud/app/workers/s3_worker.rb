require 'aws-sdk-s3'

class S3Worker
  include Sidekiq::Worker

  def perform
    # override this method
  end

  private

  def s3_client
    @client ||= Aws::S3::Client.new(credentials: PrinterCloud::Aws.credentials)
  end

  def s3_resource
    @resource ||= Aws::S3::Resource.new(credentials: PrinterCloud::Aws.credentials)
  end

  def bucket
    @bucket ||= ENV['AWS_BUCKET']
  end
end
