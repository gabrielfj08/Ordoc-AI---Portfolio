class ShareableLinkWorker
  include Sidekiq::Worker

  def perform(id, document_id)
    @document = Document.find(document_id)
    @shareable_link = ShareableLink.find(id)

    @shareable_link.perform
    @shareable_link.finish!
  rescue StandardError => e
    raise
    @shareable_link.fail!
  end
end
