module PrinterAir
  class DocumentUploadWorker < UploadFileWorker
    sidekiq_options queue: :default

    def perform(id)
      @document_upload_job = PrinterAir::DocumentUploadJob.find(id)
      return if @document_upload_job.finished?

      create_target_path
      download_target
      create_document
      delete_target
      delete_file_from_aws
    rescue StandardError => e
      raise
      @document_upload_job.fail!
    end

    private

    def bucket
      'printer-air-document-upload'
    end

    def create_document
      ActiveRecord::Base.transaction do
        @document = ::PrinterAirServices::DocumentCreator.new(directory_id: directory.id,
                                                              description: description,
                                                              location: location,
                                                              original_filename: original_filename,
                                                              created_by_id: created_by_id,
                                                              path: target,
                                                              ocr: ocr).call

        @document_upload_job.finish!
      end
    end

    def directory
      PrinterAir::Directory.kept.find_by(prn: directory_prn)
    end

    def directory_prn
      "#{File.dirname(@document_upload_job.document_prn)}/"
    end

    def description
      @document_upload_job.description
    end

    def original_filename
      File.basename(s3_key)
    end

    def location
      @document_upload_job.location
    end

    def created_by_id
      @document_upload_job.created_by_id
    end

    def s3_key
      @document_upload_job.s3_key
    end

    def ocr
      @document_upload_job.ocr
    end
  end
end
