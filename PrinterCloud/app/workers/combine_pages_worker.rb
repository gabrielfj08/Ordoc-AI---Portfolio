class CombinePagesWorker < S3Worker
  def perform(document_id)
    @document = Document.find(document_id)
    @pages = Page.where(document_id: document_id)

    pdf = CombinePDF.new

    @pages.order(created_at: :asc).each do |page|
      downloaded_page = page.file.download
      pdf << CombinePDF.parse(downloaded_page)
    end

    pdf.save("/tmp/#{@document.original_filename}")

    @document.processed_file.attach(io: File.open("/tmp/#{@document.original_filename}"),
                                    filename: File.basename(@document.original_filename), content_type: 'application/pdf')
    FileUtils.rm("/tmp/#{@document.original_filename}")
  rescue StandardError => e
    raise
    @document.fail!
  end
end
