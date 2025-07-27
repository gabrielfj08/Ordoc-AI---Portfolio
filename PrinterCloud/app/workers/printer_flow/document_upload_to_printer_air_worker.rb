module PrinterFlow
  class DocumentUploadToPrinterAirWorker < PrinterAir::UploadFileWorker
    sidekiq_options queue: :medium

    def perform(params)
      @procedure_ids = params['ids']
      @path = params['destination_directory_id']

      create_procedure_report_document
      create_target_path
      download_target
      create_procedure_report_document_for_printer_air
      delete_target
    rescue StandardError => e
      raise
    end

    private

    def create_procedure_report_document
      ::PrinterFlow::Procedure.where(id: @procedure_ids).each do |procedure|
        @procedure_report = procedure.procedure_reports.where(procedure_status: 'finished').first
        @document = @procedure_report.document
      end
    end

    def create_procedure_report_document_for_printer_air
      @procedure_report_document = ::PrinterAirServices::DocumentCreator.new({ directory_id: @path,
                                                                               original_filename: @document.original_filename,
                                                                               decription: @document.description,
                                                                               location: @document.location,
                                                                               created_by_id: @document.created_by_id,
                                                                               path: target,
                                                                               ocr: false }).call
      @procedure_report_document.reindex
    end

    def created_by_id
      @batch_operation.created_by_id
    end

    def s3_key
      @document.file.key
    end
  end
end
