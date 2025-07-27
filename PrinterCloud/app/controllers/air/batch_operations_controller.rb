module Air
  class BatchOperationsController < BaseController
    before_action :set_accessible_document_ids, only: [:create]
    before_action :set_accessible_directory_ids, only: [:create]
    load_ability :batch_operation

    def create
      batch_operation_creator = AirServices::BatchOperationCreator.new(action: params[:batch_action],
                                                                       payload: params[:payload],
                                                                       created_by: current_user,
                                                                       document_ids: @document_ids,
                                                                       directory_ids: @directory_ids)

      batch_operation = batch_operation_creator.call

      render json: batch_operation, status: :ok
    end

    def show
      @batch_operation = BatchOperation.find(params[:id])
      authorize! :read, @batch_operation
      render json: @batch_operation, serializer: BatchOperationSerializer::Show, status: :ok
    end

    private

    def set_accessible_directory_ids
      @directory_ids = Directory.where(department: current_user.departments.pluck(:id)).where(id: params[:directory_ids]).pluck(:id)
    end

    def set_accessible_document_ids
      @document_ids = Document.where(department: current_user.departments.pluck(:id)).where(id: params[:document_ids]).pluck(:id)
    end
  end
end
