module Flow
  class AssigneesController < BaseController
    before_action :set_task
    load_ability :task

    def index
      render json: @task.assignee, status: :ok
    end

    private

    def set_task
      @task = Task.find(params[:task_id])
      authorize! :read, @task
    end
  end
end
