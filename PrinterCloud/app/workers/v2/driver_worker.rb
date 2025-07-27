module V2
  class DriverWorker
    include Shoryuken::Worker

    shoryuken_options queue: -> { "driver-#{ENV['RAILS_ENV']}" }, auto_delete: :true, body_parser: :json

    def perform(_sqs_msg, options)
      @message = JSON.parse(options['Message'])

      unless invalid_path?
        document_upload_job = ::PrinterDriver::DocumentUploadJob.create(bucket: bucket,
                                                                        organization_id: organization,
                                                                        key: key,
                                                                        path: path,
                                                                        service: :driver)&.run!
      end
    end

    private

    def invalid_path?
      File.extname(path).include?('.filepart') || path[-1].include?('/')
    end

    def bucket
      'printer-driver'
    end

    def organization
      key.split('/', 3).second
    end

    def key
      CGI.unescape(@message['Records'][0]['s3']['object']['key'])
    end

    def path
      key.split('/', 3).last
    end
  end
end
