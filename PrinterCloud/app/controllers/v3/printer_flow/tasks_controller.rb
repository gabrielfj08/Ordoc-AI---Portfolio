module V3
  module PrinterFlow
    class TasksController < BaseController
      before_action :set_task,
                    only: %i[show update destroy accept refuse set_assignee reset_assignee finish update_field]
      before_action :set_group_assignee, only: %i[set_assignee reset_assignee]
      load_ability :task, :task_field

      def index
        tasks = @organization.tasks
                             .accessible_by(current_ability)
                             .includes(:procedure)
                             .includes(:assignee)
                             .includes(:group_assignee)
                             .filter_by(filter_params)
                             .search_by(params[:q])
                             .order_by(order_params)
                             .paginate(page: params[:page], per_page: params[:per_page])

        render json: tasks, meta: { total: tasks.count },
               each_serializer: V3::TaskSerializer::List, adapter: :json, status: :ok
      end

      def show
        authorize! :read, @task

        render json: @task, serializer: V3::TaskSerializer::Show, status: :ok
      end

      def create
        task = ::PrinterFlow::Task.new(create_params)
        authorize! :create, task

        task = ::PrinterFlowServices::TaskCreator.new(create_params).call

        render json: task, serializer: V3::TaskSerializer::Show, status: :created
      end

      def update
        authorize! :update, @task
        @task.update!(update_params)

        render json: @task, serializer: V3::TaskSerializer::Show, status: :ok
      end

      def update_field
        task_field = @task.task_fields.find(params[:task_field_id])

        authorize! :update, task_field

        task_field.update!(update_field_params)

        render json: task_field, serializer: V3::TaskFieldSerializer::Show, status: :ok
      end

      def set_assignee
        authorize! :update, @task

        task = ::PrinterFlowServices::TaskAssigneeSetter.new({ task: @task,
                                                               group_assignee: @group_assignee }).call

        render json: task, serializer: V3::TaskSerializer::Show, status: :ok
      end

      def reset_assignee
        authorize! :reset_assignee, @task

        task = ::PrinterFlowServices::TaskAssigneeResetter.new({ task: @task,
                                                                 group_assignee: @group_assignee,
                                                                 action: params[:action],
                                                                 note: params[:note],
                                                                 created_by: current_user.internal_requester }).call

        render json: task, serializer: V3::TaskSerializer::Show, status: :ok
      end

      def accept
        authorize! :update, @task
        ActiveRecord::Base.transaction do
          @task.update!(assignee_id: current_user.internal_requester.id)
          @task.start!
        end

        render json: @task, serializer: V3::TaskSerializer::Show, status: :ok
      end

      def refuse
        authorize! :update, @task

        task = ::PrinterFlowServices::TaskRefuser.new({ task: @task,
                                                        created_by: current_user.internal_requester,
                                                        action: params[:action],
                                                        note: params[:note] }).call

        render json: task, serializer: V3::TaskSerializer::Show, status: :ok
      end

      def finish
        authorize! :update, @task
        @task.finish!

        render json: @task, serializer: V3::TaskSerializer::Show, status: :ok
      end

      def destroy
        authorize! :destroy, @task
        @task.destroy!

        render json: @task, serializer: V3::TaskSerializer::Show, status: :ok
      end

      def count_by_status
        tasks_count = ::PrinterFlow::Task.count_by_status(current_user, params[:group_assignee_id])

        render json: tasks_count, status: :ok
      end

      private

      def set_task
        @task = @organization.tasks.find(params[:id] || params[:task_id])
      end

      def set_group_assignee
        @group_assignee = @organization.requesters.not_internal.find(params[:group_assignee_id])
      end

      def create_params
        params.require(:task)
              .permit(:name, :description, :procedure_id, :task_template_id).merge!(created_by_id: current_user.id)
      end

      def update_params
        params.permit(:name, :description, :priority, :deadline)
      end

      def order_params
        params.permit(:order, :direction)
      end

      def filter_params
        params.permit(:procedure_id, :assignee_id, :group_assignee_id, :created_by_id, status: [], priority: [])
      end

      def update_field_params
        params.require(:task_field).permit(:value, array_values: [])
      end
    end
  end
end
