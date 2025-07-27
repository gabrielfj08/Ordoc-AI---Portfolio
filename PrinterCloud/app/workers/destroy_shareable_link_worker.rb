class DestroyShareableLinkWorker
  include Sidekiq::Worker

  def perform(id)
    @destroy_shareable_link = DestroyShareableLink.find(id)
    @document = Document.find(@destroy_shareable_link.document_id)

    @destroy_shareable_link.perform
    @destroy_shareable_link.finish!
  rescue StandardError => e
    raise
    @destroy_shareable_link.fail!
  end
end
