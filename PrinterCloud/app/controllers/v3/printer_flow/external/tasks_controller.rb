module V3
  module PrinterFlow
    module External
      class TasksController < BaseController
        before_action :set_task, only: %i[show accept refuse finish]
        load_ability :task

        def index
          tasks = @organization.tasks
                               .accessible_by(current_ability)
                               .includes(:created_by)
                               .filter_by(filter_params)
                               .search_by(params[:q])
                               .order_by(order_params)
                               .paginate(page: params[:page], per_page: params[:per_page])

          render json: tasks, meta: { total: tasks.total_entries },
                 each_serializer: ::V3::External::TaskSerializer::List, adapter: :json, status: :ok
        end

        def show
          authorize! :read, @task

          render json: @task, serializer: V3::External::TaskSerializer::Show, status: :ok
        end

        def accept
          authorize! :update, @task
          ActiveRecord::Base.transaction do
            @task.update!(assignee_id: current_user.id)
            @task.start!
          end

          render json: @task, serializer: V3::External::TaskSerializer::Show, status: :ok
        end

        def refuse
          authorize! :update, @task

          task = ::PrinterFlowServices::TaskRefuser.new({ task: @task,
                                                          created_by: current_user,
                                                          action: params[:action],
                                                          note: params[:note] }).call

          render json: task, serializer: ::V3::TaskSerializer::Show, status: :ok
        end

        def finish
          authorize! :update, @task
          @task.finish!

          render json: @task, serializer: V3::External::TaskSerializer::Show, status: :ok
        end

        private

        def set_task
          @task = @organization.tasks.find(params[:id] || params[:task_id])
        end

        def order_params
          params.permit(:order, :direction)
        end

        def filter_params
          params.permit(:procedure_id, :group_assignee_id, :assignee_id, status: [])
        end
      end
    end
  end
end
