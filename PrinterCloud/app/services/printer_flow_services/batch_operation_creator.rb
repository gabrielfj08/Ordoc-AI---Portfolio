module PrinterFlowServices
  class BatchOperationCreator < ApplicationService
    def initialize(params)
      @ids = params[:ids]
      @record_type = params[:record_type]
      @action = params[:action]
      @payload = params[:payload]
      @created_by = params[:created_by]
    end

    def call
      @batch_operation = create_batch_operation

      @batch_operation
    end

    private

    def create_batch_operation
      ::PrinterFlow::BatchOperation.create!(record_type: @record_type,
                                            ids: @ids,
                                            action: @action,
                                            payload: @payload,
                                            created_by: @created_by)
    end
  end
end
