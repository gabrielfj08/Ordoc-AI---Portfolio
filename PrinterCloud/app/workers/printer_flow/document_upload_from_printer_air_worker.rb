module PrinterFlow
  class DocumentUploadFromPrinterAirWorker < ::PrinterAir::UploadFileWorker
    sidekiq_options queue: :medium

    def perform(params)
      @resource_class = params['class'].constantize
      @object = @resource_class.find(params['id'])
      @path = params['destination_directory_path']
      @printer_air_document_prn = @object.key
      @document = ::PrinterAir::Document.find_by!(prn: @printer_air_document_prn)

      return if @object.finished?
      return if @object.document_id.present?

      set_directory
      create_target_path
      download_target
      create_copy_for_printer_flow
      delete_target
    rescue ActiveRecord::RecordInvalid => e
      retry
    rescue ActiveRecord::RecordNotUnique => e
      retry
    rescue StandardError => e
      raise
      @object.fail!
    end

    private

    def create_copy_for_printer_flow
      ActiveRecord::Base.transaction do
        @copy = PrinterAirServices::DocumentCreator.new({ directory_id: @directory.id,
                                                          original_filename: @document.original_filename,
                                                          decription: @printer_air_document_prn,
                                                          location: @document.location,
                                                          created_by_id: @document.created_by_id,
                                                          path: target,
                                                          ocr: true }).call

        @object.update!(document_id: @copy.id)
        @object.finish!
      end
    end

    def set_directory
      @directory ||= PrinterAir::Directory.find_or_create_by_prn(
        "prn:printer_air:#{organization.cnpj}:Meu Air/#{@path}", created_by_id
      )
    end

    def created_by_id
      @object.created_by_id
    end

    def organization
      @object.organization
    end

    def s3_key
      @document.file.key
    end
  end
end
