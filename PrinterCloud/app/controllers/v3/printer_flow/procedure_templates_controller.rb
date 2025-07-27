module V3
  module PrinterFlow
    class ProcedureTemplatesController < BaseController
      before_action :set_procedure_template, only: %i[show update activate deactivate]

      def index
        procedure_templates = @organization.procedure_templates
                                           .accessible_by_user(current_user)
                                           .filter_by(filter_params)
                                           .search_by(params[:q])
                                           .order_by(order_params)
                                           .paginate(page: params[:page], per_page: params[:per_page])

        render json: procedure_templates, meta: { total: procedure_templates.count },
               each_serializer: V3::ProcedureTemplateSerializer::List, adapter: :json, status: :ok
      end

      def show
        authorize :read, @procedure_template

        render json: @procedure_template, serializer: V3::ProcedureTemplateSerializer::Show, status: :ok
      end

      def create
        @procedure_template = @organization.procedure_templates.new(create_params)
        @procedure_template.generate_prn

        authorize :create, @procedure_template

        @procedure_template.save!

        render json: @procedure_template, serializer: V3::ProcedureTemplateSerializer::Show, status: :created
      end

      def update
        authorize :update, @procedure_template

        @procedure_template.update!(update_params)

        render json: @procedure_template, serializer: V3::ProcedureTemplateSerializer::Show, status: :ok
      end

      def activate
        authorize :update, @procedure_template

        @procedure_template.activate!

        render json: @procedure_template, serializer: V3::ProcedureTemplateSerializer::Show, status: :ok
      end

      def deactivate
        authorize :update, @procedure_template
        @procedure_template = ::PrinterFlowServices::ProcedureTemplateDeactivator.new({ procedure_template: @procedure_template,
                                                                                        created_by: current_user.internal_requester,
                                                                                        note: params[:note],
                                                                                        action: params[:action] }).call

        render json: @procedure_template, serializer: V3::ProcedureTemplateSerializer::Show, status: :ok
      end

      private

      def set_procedure_template
        @procedure_template = @organization.procedure_templates.find(params[:id] || params[:procedure_template_id])
      end

      def filter_params
        params.permit(:parent_procedure_template_id, :root, status: [], source: [])
      end

      def create_params
        params.require(:procedure_template).permit(:name, :group_requester_id, :parent_procedure_template_id, :source,
                                                   :status, :prn)
      end

      def order_params
        params.permit(:order, :direction)
      end

      def update_params
        params.require(:procedure_template).permit(:name, :group_requester_id, :source)
      end
    end
  end
end
