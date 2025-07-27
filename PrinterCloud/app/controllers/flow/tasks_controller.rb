module Flow
  class TasksController < BaseController
    before_action :set_task, only: [:show, :update, :destroy, :finish, :set_assignees, :set_group_assignee, :accept_task, :restore, :refuse_task]
    before_action :task_must_be_draft, only: [:update, :set_assignees, :set_group_assignee]
    load_ability :task, :user

    def index
      @tasks =  Flow::Task.kept
                          .includes(:procedure)
                          .filter_by(filter_params)
                          .order_by(order_params)
                          .search_by(params[:q])
                          .accessible_by(current_ability)
                          .paginate(page: params[:page])
            
      render json: @tasks, each_serializer: TaskSerializer::List, status: :ok
    end

    def show
      authorize! :read, @task
      render json: @task, serializer: TaskSerializer::Show
    end

    def create
      @task = Flow::Task.new(create_task_params)
      authorize! :create, @task

      @task.save!
      History.create!(history_params.merge(action: :created))
      render json: @task, serializer: TaskSerializer::Show, status: :created
    end

    def update
      authorize! :update, @task
      @task.update!(update_task_params)
      render json: @task, serializer: TaskSerializer::Show, status: :ok
    end

    def destroy
      authorize! :destroy, @task
      @task.discard
  
      render json: @task, serializer: TaskSerializer::Show, status: :ok
    end

    def finish
      authorize! :update, @task
      @task.finish!

      render json: @task, serializer: TaskSerializer::Show, status: :ok
    end

    def set_assignees
      authorize! :update, @task
      assignee = User.find_by(id: params[:user_ids])

      authorize! :read, assignee
      raise Error::AssigneeCannotJoinTaskError unless Organization.filter_by_organization_member_id(assignee.id).include?(@task.department.organization)

      @task.assignee = assignee

      render json: @task, status: :ok
    end

    def set_group_assignee
      authorize! :update, @task
      user_group = Flow::UserGroup.find(params[:user_group_id])

      @task.group_assignee = user_group

      render json: @task, serializer: TaskSerializer::Show, status: :ok
    end

    def restore
      authorize! :update, @task
      @task.restore
      render json: @task, serializer: TaskSerializer::Show, status: :ok
    end

    def accept_task
      authorize! :read, @task

      FlowServices::TaskAssignmentAccepter.call!(
        user_id: current_user.id,
        task_id: @task.id
      )

      render json: @task, serializer: TaskSerializer::Show
    end
    
    def refuse_task
      authorize! :read, @task

      FlowServices::TaskAssignmentRefuser.call!(
        user_id: current_user.id,
        task_id: @task.id,
        refusing_note_params: refusing_note_params
      )

      render json: @task, serializer: TaskSerializer::Show
    end

    #TODO: deprecate method/route
    def index_my_tasks
      ids = (Flow::Task.filter_by_group_assignee_id(current_user.id) + Flow::Task.filter_by_assignee_id(current_user.id)).uniq.pluck(:id)
      @tasks =  Flow::Task.where(id: ids).kept
                                         .includes(:procedure)
                                         .filter_by(filter_params)
                                         .order_by(order_params)
                                         .search_by(params[:q])
                                         .accessible_by(current_ability)
                                         .paginate(page: params[:page])

      render json: @tasks, each_serializer: TaskSerializer::Show
    end

    private

    def refusing_note_params
      params.permit(:task_id, :body).merge!(created_by_id: current_user.id)
    end

    def order_params
      params.permit(:order, :direction)
    end

    def filter_params
      params.permit(:procedure_id, :department_id, :organization_id,
                    :group_assignee_id, :created_by_id, :accepted_by_id,
                    :assigned_user_group_id, :assigned_department_id,
                    :assignee_id, :assigned_user_id, :assigned_by_id, statuses:[])
            .with_defaults(statuses: Flow::Task::STATUSES.keys)
    end

    def set_task
      @task = Flow::Task.kept.find(params[:id] || params[:task_id])
    end

    def create_task_params
      params.require(:task).permit(:name, :description, :procedure_id)
    end

    def update_task_params
      params.require(:task).permit(:name, :description)
    end

    def history_params
      { trackable: @task, user: current_user }
    end

    def task_must_be_draft
      raise Error::RecordFrozenError unless @task.draft?
    end
  end
end
