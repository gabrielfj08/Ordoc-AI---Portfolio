module PrinterAirServices
  class DocumentKeepMover < ApplicationService
    def initialize(params)
      @i = 0
      @document = params[:record]
      @destination = params[:destination]
      @original_filename = @document.original_filename
      @updated_by_id = params[:created_by_id]
      @versions = PrinterAir::Document.where(prn: @document.prn).where.not(id: @document.id)
    end

    def call!
      ActiveRecord::Base.transaction do
        @document.update!(original_filename: filename,
                          updated_by_id: @updated_by_id,
                          directory_id: @destination.id)
        move_versions
      end
    rescue ActiveRecord::RecordInvalid => e
      raise unless @document.errors.include?(:prn)

      @i += 1
      retry
    end

    private

    def move_versions
      @versions.each do |version|
        version.update(directory_id: @destination.id)
      end
    end

    def filename
      filename = @original_filename

      if @i != 0
        filename =
          "#{file_basename}(#{@i})#{file_extension}"
      end

      filename
    end

    def file_basename
      ActiveStorage::Filename.new(@original_filename).base
    end

    def file_extension
      ActiveStorage::Filename.new(@original_filename).extension_with_delimiter
    end
  end
end
