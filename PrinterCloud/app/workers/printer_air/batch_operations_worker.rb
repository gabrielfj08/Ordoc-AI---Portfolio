module PrinterAir
  class BatchOperationsWorker
    include Sidekiq::Worker

    sidekiq_options queue: :heavy

    def perform(id)
      @batch_operation = PrinterAir::BatchOperation.find(id)

      @batch_operation.perform
      @batch_operation.finish!
    rescue StandardError => e
      raise
      @batch_operation.fail!
    end
  end
end
