module V3
  module PrinterFlow
    module External
      class TaskDocumentsController < BaseController
        before_action :set_task, only: %i[show create destroy]
        before_action :set_task_document, only: %i[show destroy]
        load_ability :task_document

        def index
          task_documents = @organization.task_documents
                                        .includes(:created_by)
                                        .accessible_by(current_ability)
                                        .filter_by(filter_params)
                                        .order_by(order_params)
                                        .paginate(page: params[:page], per_page: params[:per_page])

          render json: task_documents, meta: { total: task_documents.total_entries },
                 each_serializer: V3::External::TaskDocumentSerializer::List, adapter: :json, status: :ok
        end

        def show
          authorize! :read, @task_document

          render json: @task_document, serializer: V3::External::TaskDocumentSerializer::Show, status: :ok
        end

        def create
          task_document = @task.task_documents.new(create_params)
          authorize! :create, task_document
          task_document.save!

          render json: task_document, serializer: V3::External::TaskDocumentSerializer::Show, status: :created
        end

        def destroy
          authorize! :destroy, @task_document
          @task_document.destroy!

          render json: @task_document, serializer: V3::External::TaskDocumentSerializer::Show, status: :ok
        end

        private

        def create_params
          params.require(:task_document).permit(:s3_key, :name).merge!(created_by_id: ENV['EXTERNAL_USER_ID'],
                                                                       source: :upload, key: params['task_document']['s3_key'])
        end

        def set_task
          @task = @organization.tasks.find(params[:task_id])
        end

        def set_task_document
          @task_document = @task.task_documents.find(params[:id])
        end

        def order_params
          params.permit(:order, :direction)
        end

        def filter_params
          params.permit(:task_id, :procedure_id, :created_by_id, status: [])
        end
      end
    end
  end
end
