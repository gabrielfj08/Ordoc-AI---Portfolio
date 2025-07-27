class OcrWorkflowWorker
  include Sidekiq::Worker

  def perform(document_id, queue_options)
    @document = Document.find(document_id)

    @queue_options = queue_options
    i = 0

    FileUtils.mkdir_p("/tmp/#{@document.id}/")
    CombinePDF.parse(@document.file.download, allow_optional_content: true).pages.each do |page|
      pdf = CombinePDF.new
      pdf << page
      pdf.save("/tmp/#{@document.id}/page_file.pdf")
      new_page = Page.create(document_id: @document.id, name: "#{i += 1}.pdf")
      new_page.file.attach(io: File.open("/tmp/#{@document.id}/page_file.pdf"),
                           filename: @document.original_filename,
                           content_type: @document.file.content_type)
    end

    batch = Sidekiq::Batch.new
    batch.on(:success, OcrWorkflowCallbacks, 'document_id' => @document.id)
    pages = Page.where(document_id: @document.id)
    batch.jobs do
      pages.each { |page| page.enqueue!(@queue_options) unless page.processed? }
    end

    FileUtils.rm_rf("/tmp/#{@document.id}")
  rescue RangeError => e
    @document.fail!
  rescue StandardError => e
    raise
    @document.fail!
  end
end
