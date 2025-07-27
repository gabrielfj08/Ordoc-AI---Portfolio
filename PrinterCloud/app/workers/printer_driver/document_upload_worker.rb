module PrinterDriver
  class DocumentUploadWorker < S3Worker
    sidekiq_options queue: :medium

    def perform(id)
      @document_upload_job = PrinterDriver::DocumentUploadJob.find(id)

      PathValidator.validate!(path)
      create_target_path
      download_target
      create_document_and_attach_file
      delete_target
      @document_upload_job.finish!
    rescue Errno::EISDIR => e
      @document_upload_job.invalidate!
    end

    private

    def create_target_path
      FileUtils.mkdir_p(target_path)
    end

    def download_target
      s3_client.get_object(bucket: bucket, key: key, response_target: target)
    end

    def delete_target
      FileUtils.rm(target)
    end

    def create_document_and_attach_file
      ensure_document_is_not_corrupted

      doc = PrinterAirServices::DocumentCreator.new({ description: 'Carregado via Driver',
                                                      original_filename: File.basename(key),
                                                      created_by_id: created_by_id,
                                                      path: target,
                                                      directory_id: directory.id,
                                                      ocr: true }).call
    end

    def directory
      @directory ||= PrinterAir::Directory.find_or_create_by_prn(
        "prn:printer_air:#{organization.cnpj}:Meu Air/#{path}", created_by_id
      )
    end

    def created_by_id
      ENV["#{@document_upload_job.service.upcase + '_ID'}"]
    end

    def bucket
      @document_upload_job.bucket
    end

    def organization
      @document_upload_job.organization
    end

    def key
      @document_upload_job.key
    end

    def path
      File.dirname(@document_upload_job.path).split('Meu Air/', 2).last
    end

    def target_path
      File.dirname(target)
    end

    def target
      "/tmp/#{@document_upload_job.path}"
    end

    def ensure_document_is_not_corrupted
      return if File.basename(key) != '.pdf'

      result = IO.binread(target, 4).unpack1('H*')
      download_target unless result == '25504446'
    end
  end
end
