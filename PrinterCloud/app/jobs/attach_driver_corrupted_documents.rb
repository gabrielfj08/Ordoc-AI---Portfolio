class AttachDriverCorruptedDocuments
  include Sidekiq::Worker

  def perform
    retries = Sidekiq::RetrySet.new
    ids = []
    retries.each do |job|
      ids << job.args[0] if job.klass == 'V2::OcrWorkflowWorker'
    end

    @s3_client = Aws::S3::Client.new(credentials: PrinterCloud::Aws.credentials)

    PrinterAir::Document.where(id: ids).find_each do |document|
      destination = File.dirname(document.prn.split('/', 2).last)
      FileUtils.mkdir_p("tmp/#{destination}")

      @s3_client.get_object(bucket: 'printer-driver',
                            key: "production/#{document.organization.id}/#{document.prn.split('/', 2).last}",
                            response_target: "tmp/#{document.prn.split('/', 2).last}")

      document.file.attach(io: File.open("tmp/#{document.prn.split('/', 2).last}"),
                           filename: document.original_filename)

      FileUtils.rm("tmp/#{document.prn.split('/', 2).last}")
    rescue Aws::S3::Errors::NoSuchKey => e
      false
    end
  end
end
