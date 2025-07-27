module V4
  module PrinterFlow
    class TaskDocumentsController < BaseController
      before_action :set_task, only: %i[show create destroy]
      before_action :set_task_document, only: %i[show destroy]
      load_ability :task, :task_document

      def index
        task_documents = @organization.task_documents
                                      .accessible_by(current_ability)
                                      .filter_by(filter_params)
                                      .order_by(order_params)
                                      .paginate(page: params[:page], per_page: params[:per_page])

        render json: task_documents, meta: { total: task_documents.count },
               each_serializer: V4::TaskDocumentSerializer::List, adapter: :json, status: :ok
      end

      def show
        authorize! :read, @task_document
        render json: @task_document,
               serializer: V4::TaskDocumentSerializer::Show, status: :ok
      end

      def create
        task_document = @task.task_documents.new(create_params)
        authorize! :create, task_document
        task_document.save!

        render json: task_document, serializer: V4::TaskDocumentSerializer::Show, status: :created
      end

      def destroy
        authorize! :destroy, @task_document
        @task_document.destroy!

        render json: @task_document, serializer: V4::TaskDocumentSerializer::Show, status: :ok
      end

      private

      def create_params
        params.require(:task_document).permit(:key, :name, :source).merge!(created_by_id: current_user.id,
                                                                           s3_key: params['task_document']['key'])
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
        params.permit(:procedure_id, :task_id, :created_by_id, status: [], source: [])
      end
    end
  end
end
