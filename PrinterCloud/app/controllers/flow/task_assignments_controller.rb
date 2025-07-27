module Flow
  class TaskAssignmentsController < BaseController
    before_action :set_task, only: [:update, :show]
    load_ability :task, :task_assignment

    def index
    end

    def show
      @task_assignment = @task.task_assignment
      authorize! :read, @task_assignment

      render json: @task_assignment, status: :ok
    end

    def create
      @task_assignment = TaskAssignment.new(create_params)
      authorize! :create, @task_assignment
      @task_assignment.save!

      render json: @task_assignment,  serializer: TaskAssignmentSerializer::Show, status: :created
    end

    def update
      @task_assignment = @task.task_assignment
      authorize! :update, @task_assignment

      task_assignment_updater = FlowServices::TaskAssignmentUpdater.new(update_params)

      @task_assignment = task_assignment_updater.call

      render json: @task_assignment, serializer: TaskAssignmentSerializer::Show, status: :ok
    end

    def destroy
    end

    private

    def create_params
      params.require(:task_assignment).permit(:task_id, :user_id)
    end

    def set_task
      @task = Flow::Task.find(params[:task_id])
      authorize! :read, @task
    end

    def update_params
      params.permit(:task_id, :body, :user_id, :user_group_id)
    end
  end
end
