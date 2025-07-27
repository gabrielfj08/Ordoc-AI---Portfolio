class DocumentDownloaderWorker < S3Worker
  include Sidekiq::Worker

  def perform(options)
    bucket = options['bucket'] || ENV['AWS_BUCKET']
    
    full_path = "tmp/download/#{options['jid']}/#{options['path'].to_s}"
    entry = "#{full_path}#{options['name'] || options['key']}"
    FileUtils.mkdir_p(full_path)
    
    s3_client.get_object({ bucket: bucket, key:  options['key']}, target: entry)
  end

  def s3_client
    Aws::S3::Client.new(credentials: PrinterCloud::Aws.credentials)
  end
end
