module V3
  module PrinterFlow
    module External
      class ProcedureTemplatesController < BaseController
        before_action :set_procedure_template, only: :show
        load_ability :procedure_template

        def index
          procedure_templates = @organization.procedure_templates
                                             .accessible_by(current_ability)
                                             .not_internal
                                             .active
                                             .filter_by(filter_params)
                                             .search_by(params[:q])
                                             .order_by(order_params)
                                             .paginate(page: params[:page], per_page: params[:per_page])

          render json: procedure_templates, meta: { total: procedure_templates.total_entries },
                 each_serializer: V3::External::ProcedureTemplateSerializer::List, adapter: :json, status: :ok
        end

        def show
          authorize! :read, @procedure_template

          render json: @procedure_template, serializer: V3::External::ProcedureTemplateSerializer::Show, status: :ok
        end

        private

        def set_procedure_template
          @procedure_template = @organization.procedure_templates.not_internal.active.find(params[:id])
        end

        def filter_params
          params.permit(:parent_procedure_template_id, :root)
        end

        def order_params
          params.permit(:order, :direction)
        end
      end
    end
  end
end
