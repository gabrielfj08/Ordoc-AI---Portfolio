module PrinterAirServices
  class DocumentCreator < ApplicationService
    def initialize(params)
      @i = 0
      @directory = ::PrinterAir::Directory.find(params[:directory_id])

      @original_filename = params[:original_filename]
      @description = params[:description]
      @location = params[:location]
      @created_by_id = params[:created_by_id]
      @path = params[:path]
      @ocr = params[:ocr]
    end

    def call
      ActiveRecord::Base.transaction do
        @document = @directory.documents.new(original_filename: filename,
                                             description: @description,
                                             location: @location,
                                             created_by_id: @created_by_id,
                                             updated_by_id: @created_by_id,
                                             version_id: nil)
        @document.save!
        @document.file.attach(io: File.open(@path),
                              filename: filename)
        @document.enqueue! if @ocr == true
        @document
      end
    rescue ActiveRecord::RecordInvalid => e
      raise unless @document.errors.include?(:prn)

      @i += 1
      retry
    end

    private

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
