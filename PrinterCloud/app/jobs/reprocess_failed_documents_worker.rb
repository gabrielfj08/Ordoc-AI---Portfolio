class ReprocessFailedDocumentsWorker
  include Sidekiq::Worker

  def perform
    PrinterAir::Document.where('created_at > ?',
                               Date.yesterday.at_beginning_of_day).where(status: %i[failed
                                                                                    enqueued]).find_each do |document|
      document.fail!
      document.pages.where(status: :failed).each(&:destroy)
      document.enqueue!
    end
  end
end
