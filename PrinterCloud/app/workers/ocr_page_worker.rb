class OcrPageWorker < S3Worker
  def perform(id)
    @page = Page.find(id)

    begin
      @started_at = Time.now

      FileUtils.mkdir_p('/tmp/pages/')
      s3_client.get_object(bucket: bucket, key: key, response_target: "/tmp/pages/#{key}")
      system "ocrmypdf --force-ocr -l por /tmp/pages/#{key} /tmp/pages/#{key}"

      @page.file.attach(io: File.open("/tmp/pages/#{key}"), filename: @page.name, content_type: 'application/pdf')

      @finished_at = Time.now
      @duration = @finished_at - @started_at

      PageMetric.create!(page: @page, byte_size: @page.file.byte_size, duration: @duration)

      FileUtils.rm_rf('/tmp/pages')

      @page.process! unless @page.processed?
    rescue StandardError => e
      raise
      @page.fail!
    end
  end

  private

  def key
    @page.file.key
  end
end
