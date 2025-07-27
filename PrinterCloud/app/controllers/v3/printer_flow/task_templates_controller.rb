module V3
  module PrinterFlow
    class TaskTemplatesController < BaseController
      before_action :set_task_template, only: %i[show update activate deactivate]

      def index
        task_templates = @organization.task_templates
                                      .accessible_by_user(current_user)
                                      .filter_by(filter_params)
                                      .search_by(params[:q])
                                      .order_by(order_params)
                                      .paginate(page: params[:page], per_page: params[:per_page])

        render json: task_templates, meta: { total: task_templates.total_entries },
               each_serializer: V3::TaskTemplateSerializer::List, adapter: :json, status: :ok
      end

      def show
        authorize :read, @task_template

        render json: @task_template, serializer: V3::TaskTemplateSerializer::Show, status: :ok
      end

      def create
        @task_template = @organization.task_templates.new(create_params)
        @task_template.generate_prn

        authorize :create, @task_template

        @task_template.save!

        render json: @task_template, serializer: V3::TaskTemplateSerializer::Show, status: :created
      end

      def update
        authorize :update, @task_template

        @task_template.update!(update_params)

        render json: @task_template, serializer: V3::TaskTemplateSerializer::Show, status: :ok
      end

      def activate
        authorize :update, @task_template

        @task_template.activate!

        render json: @task_template, serializer: V3::TaskTemplateSerializer::Show, status: :ok
      end

      def deactivate
        authorize :update, @task_template

        @task_template = ::PrinterFlowServices::TaskTemplateDeactivator.new({ task_template: @task_template,
                                                                              created_by: current_user.internal_requester,
                                                                              note: params[:note],
                                                                              action: params[:action] }).call

        render json: @task_template, serializer: V3::TaskTemplateSerializer::Show, status: :ok
      end

      private

      def set_task_template
        @task_template = @organization.task_templates.find(params[:id] || params[:task_template_id])
      end

      def filter_params
        params.permit(:name, status: [])
      end

      def order_params
        params.permit(:order, :direction)
      end

      def create_params
        params.require(:task_template).permit(:name, :description)
      end

      def update_params
        params.require(:task_template).permit(:name, :description)
      end
    end
  end
end
