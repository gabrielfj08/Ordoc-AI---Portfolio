module V3
  module PrinterFlow
    class TaskFieldsController < BaseController
      before_action :set_task_template, only: %i[index show update create destroy]
      before_action :set_task_field, only: %i[show update destroy]
      before_action :set_task, only: %i[update_on_task]
      load_ability :task_field

      def index
        authorize :list, @task_template

        task_fields = @task_template.task_fields
                                    .filter_by(filter_params)
                                    .search_by(params[:q])
                                    .order_by(order_params)
                                    .paginate(page: params[:page], per_page: params[:per_page])

        render json: task_fields, meta: { total: task_fields.total_entries },
               each_serializer: ::V3::TaskFieldSerializer::List, adapter: :json, status: :ok
      end

      def index_task_field_types
        field_types = ::PrinterFlow::TaskField::FIELD_TYPES.keys
                                                           .paginate(page: params[:page], per_page: params[:per_page])

        render json: { field_types: field_types }, status: :ok
      end

      def show
        authorize :read, @task_template

        render json: @task_field, serializer: V3::TaskFieldSerializer::Show, status: :ok
      end

      def create
        authorize :update, @task_template

        @task_field = @task_template.task_fields.create!(create_params)

        render json: @task_field, serializer: V3::TaskFieldSerializer::Show, status: :created
      end

      def update
        authorize :update, @task_template

        @task_field.update!(update_params)

        render json: @task_field, serializer: V3::TaskFieldSerializer::Show, status: :ok
      end

      def destroy
        authorize :update, @task_template

        @task_field.destroy!

        render json: @task_field, serializer: V3::TaskFieldSerializer::Show, status: :ok
      end

      private

      def set_task_template
        @task_template = ::PrinterFlow::TaskTemplate.find(params[:task_template_id])
      end

      def set_task_field
        @task_field = @task_template.task_fields.find(params[:id])
      end

      def set_task
        @task = ::PrinterFlow::Task.find(params[:id] || params[:task_id])
      end

      def order_params
        params.permit(:order, :direction)
      end

      def filter_params
        params.permit(:label, field_type: [])
      end

      def create_params
        params.require(:task_field).permit(:field_type, :label,
                                           :fieldable_id, options: [])
      end

      def update_params
        params.require(:task_field).permit(:label, :field_type, options: [])
      end
    end
  end
end
