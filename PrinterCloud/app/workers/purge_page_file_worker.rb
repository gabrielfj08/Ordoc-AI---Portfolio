class PurgePageFileWorker < S3Worker
  sidekiq_options queue: :low

  def perform(document_id)
    Page.where(document_id: document_id).find_each do |page|
      page.file.purge
    end
  end
end
