module PrinterAirServices
  class DocumentKeepRestorer < ApplicationService
    def initialize(params)
      @i = 0
      @document = params[:record]
      @destination = destination
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
        version.update(directory_id: @destination.id, original_filename: filename)
      end
    end

    def filename
      filename = previous_name

      if @i != 0
        filename =
          "#{file_basename}(#{@i})#{file_extension}"
      end

      filename
    end

    def previous_name
      @original_filename[0...-9]
    end

    def destination
      ::PrinterAir::Directory.kept.find_by(prn: @document.previous_parent_prn)
    end

    def file_basename
      ActiveStorage::Filename.new(previous_name).base
    end

    def file_extension
      ActiveStorage::Filename.new(previous_name).extension_with_delimiter
    end
  end
end
