module AirServices
  class BatchOperationCreator < ApplicationService

    def initialize(params)
      @directory_ids = params[:directory_ids]
      @document_ids = params[:document_ids]
      @action = params[:action]
      @payload = params[:payload]
      @created_by = params[:created_by]      
    end

    def call
      @batch_operation_document = create_batch_document_operation
      @batch_operation_directory = create_batch_directory_operation

      [@batch_operation_document, @batch_operation_directory]
    end

    private

    def create_batch_document_operation
      return if @document_ids.count < 1
      BatchOperation.create(record_type: 'Document',
                            ids: @document_ids,
                            action: @action,
                            payload: @payload,
                            created_by: @created_by)
    end

    def create_batch_directory_operation
      return if @directory_ids.count < 1
      BatchOperation.create(record_type: 'Directory',
                            ids: @directory_ids,
                            action: @action,
                            payload: @payload,
                            created_by: @created_by)
    end
  end
end
