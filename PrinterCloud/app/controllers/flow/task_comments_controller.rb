module Flow
  class TaskCommentsController < BaseController
    before_action :set_task
    before_action :set_task_comment, only: [:update, :destroy]
    load_ability :task, :task_comment

    def index
      @task_comments = @task.task_comments.accessible_by(current_ability)
      
      render json: @task_comments, each_serializer: TaskCommentSerializer::List, status: :ok
    end

    def create
      @task_comment = @task.task_comments.new(create_task_comment_params)
      authorize! :create, @task_comment
      @task_comment.save!

      render json: @task_comment, serializer: TaskCommentSerializer::Show, status: :ok
    end

    def update
      authorize! :update, @task_comment
      @task_comment.update!(update_task_comment_params)

      render json: @task_comment, serializer: TaskCommentSerializer::Show, status: :ok
    end

    def destroy
      authorize! :destroy, @task_comment
      @task_comment.destroy

      render json: @task_comment, serializer: TaskCommentSerializer::Show, status: :ok
    end

    private

    def create_task_comment_params
      params.require(:task_comment)
            .permit(:body, :task_id)
            .merge!(created_by_id: current_user.id)
    end

    def update_task_comment_params
      params.require(:task_comment).permit(:body)
    end

    def set_task
      @task = Flow::Task.find(params[:task_id])
      authorize! :read, @task
    end

    def set_task_comment
      @task_comment = Flow::TaskComment.find(params[:id])
    end
  end
end
