module V3
  module PrinterFlow
    class TaskCommentsController < BaseController
      before_action :set_task
      before_action :set_task_comment, only: %i[show update destroy]
      load_ability :task, :task_comment

      def index
        authorize! :read, @task
        task_comments = @task.task_comments
                             .order_by(order_params)
                             .paginate(page: params[:page], per_page: params[:per_page])

        render json: task_comments, meta: { total: task_comments.total_entries },
               each_serializer: ::V3::TaskCommentSerializer::List, adapter: :json, status: :ok
      end

      def show
        authorize! :read, @task

        render json: @task_comment, serializer: ::V3::TaskCommentSerializer::Show, status: :ok
      end

      def create
        task_comment = @task.task_comments.new(create_params)
        authorize! :create, task_comment
        task_comment.save!

        render json: task_comment, serializer: ::V3::TaskCommentSerializer::Show, status: :created
      end

      def update
        authorize! :update, @task_comment
        @task_comment.update!(update_params)

        render json: @task_comment, serializer: ::V3::TaskCommentSerializer::Show, status: :ok
      end

      def destroy
        authorize! :destroy, @task_comment
        @task_comment.destroy!

        render json: @task_comment, serializer: ::V3::TaskCommentSerializer::Show, status: :ok
      end

      private

      def set_task
        @task = @organization.tasks.find(params[:task_id])
      end

      def set_task_comment
        @task_comment = @task.task_comments.find(params[:id])
      end

      def create_params
        params.require(:task_comment).permit(:body).merge!(created_by_id: current_user.internal_requester.id)
      end

      def update_params
        params.require(:task_comment).permit(:body)
      end

      def order_params
        params.permit(:order, :direction)
      end
    end
  end
end
