module PrinterAir
  class DocumentVersionUploadWorker < UploadFileWorker
    sidekiq_options queue: :default

    def perform(id)
      @document_version_upload_job = PrinterAir::DocumentVersionUploadJob.find(id)
      @document = @document_version_upload_job.document
      return if @document_version_upload_job.finished?

      create_target_path
      download_target
      transform_current_document_in_version
      create_document
      delete_target
      delete_file_from_aws
    rescue StandardError => e
      raise
      @document_version_upload_job.fail!
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
                                                              ocr: true).call

        @document_version_upload_job.finish!
      end
    end

    def directory
      @document.directory
    end

    def original_filename
      @document.original_filename
    end

    def description
      @document_version_upload_job.description
    end

    def location
      @document_version_upload_job.location
    end

    def created_by_id
      @document_version_upload_job.created_by_id
    end

    def s3_key
      @document_version_upload_job.s3_key
    end

    def transform_current_document_in_version
      @document.update(version_id: version_id)
    end

    def version_id
      last_version ? last_version.version_id + 1 : 1
    end

    def last_version
      PrinterAir::Document.non_current.where(prn: @document.prn).order(created_at: :desc).first
    end
  end
end
