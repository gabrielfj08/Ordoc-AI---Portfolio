module PrinterAir
  class DocumentCopyWorker < UploadFileWorker
    sidekiq_options queue: :default

    def perform(id)
      @i = 0
      @document_copy = PrinterAir::DocumentCopy.find(id)
      @document = @document_copy.document

      return if @document_copy.finished?

      create_target_path
      download_target
      create_document
      delete_target
    rescue StandardError => e
      raise
      @document_copy.fail!
    end

    private

    def create_document
      ActiveRecord::Base.transaction do
        @copy = PrinterAirServices::DocumentCreator.new({ directory_id: @document.directory_id,
                                                          original_filename: original_filename,
                                                          decription: @document.description,
                                                          location: @document.location,
                                                          created_by_id: @document_copy.created_by_id,
                                                          path: target,
                                                          ocr: true })
                                                   .call
        @document_copy.finish!
      end
    end

    def original_filename
      "Cópia de #{@document.original_filename}"
    end

    def s3_key
      @document.file.key
    end
  end
end
