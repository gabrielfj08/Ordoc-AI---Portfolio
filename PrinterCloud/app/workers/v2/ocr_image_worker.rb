module V2
  class OcrImageWorker < S3Worker
    def initialize
      @i = 0

      super
    end

    def perform(id)
      @document = PrinterAir::Document.find(id)

      begin
        s3_client.get_object(bucket: bucket, key: key, response_target: "/tmp/#{key}")

        system "tesseract /tmp/#{key} /tmp/#{key} -l por pdf"
      rescue StandardError => e
        raise
        @document.fail!
      end

      @document.processed_file.attach(io: File.open("/tmp/#{key}.pdf"),
                                      filename: original_filename, content_type: 'application/pdf')

      ActiveRecord::Base.transaction do
        @document.original_filename = original_filename
        if @document.original_filename != @document.original_filename_was
          PrinterAir::DocumentShareWorker.perform_async(@document.id)
        end
        @document.save!
      end

      @document.process! unless @document.processed?
      @document.reindex

      FileUtils.rm("/tmp/#{key}")
    rescue ActiveRecord::RecordInvalid => e
      @i += 1
      retry
    end

    private

    def original_filename
      base = ActiveStorage::Filename.new(File.basename(@document.original_filename)).base
      @original_filename = "#{base}.pdf"
      if @i != 0
        @original_filename =
          "#{base}(#{@i}).pdf"
      end

      @original_filename
    end

    def key
      @document.file.key
    end
  end
end
