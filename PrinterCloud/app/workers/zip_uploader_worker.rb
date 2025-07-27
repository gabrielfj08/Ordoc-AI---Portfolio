class ZipUploaderWorker < S3Worker
  include Sidekiq::Worker
  
  def perform(options)
    object_key = "#{options['jid']}/#{options['zip_name']}.zip"

    s3_resource.bucket('printer-cloud-download')
               .object(object_key)
               .upload_file(options['path'])

    DownloadLink.find_by_jid(options['jid']).update(key: object_key)
    FileUtils.rm_rf("tmp/download/#{options['jid']}")
  end
end
