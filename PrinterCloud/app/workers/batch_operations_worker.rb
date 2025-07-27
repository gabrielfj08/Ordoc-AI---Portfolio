class BatchOperationsWorker
  include Sidekiq::Worker

  def perform(id)
    @batch_operation = BatchOperation.find(id)

    @batch_operation.perform
    @batch_operation.finish!
  rescue StandardError => e
    raise
    @batch_operation.fail!
  end
end
