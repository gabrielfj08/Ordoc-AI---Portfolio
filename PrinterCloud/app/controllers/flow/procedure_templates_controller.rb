module Flow
  class ProcedureTemplatesController < BaseController
    before_action :set_procedure_template, only: [:show, :update, :destroy, :activate, :deactivate]
    load_ability :procedure_template

    def index
      @procedure_templates = Flow::ProcedureTemplate.kept
                                                    .includes(:attachments)
                                                    .filter_by(filter_params)
                                                    .order_by(order_params)
                                                    .search_by(params[:q])
                                                    .accessible_by(current_ability)
                                                    .paginate(page: params[:page])

      render json: @procedure_templates, each_serializer: ProcedureTemplateSerializer::List, status: :ok
    end

    def show
      render json: @procedure_template, serializer: ProcedureTemplateSerializer::Show, status: :ok
    end

    def create
      procedure_template_creator = FlowServices::ProcedureTemplateCreator.new({procedure_template_params: create_procedure_template_params, user_id: current_user.id})
      authorize! :create, procedure_template_creator.procedure_template

      procedure_template = procedure_template_creator.call
  
      render json: procedure_template, serializer: ProcedureTemplateSerializer::Show, status: :created
    end

    def update
      procedure_template_updater = FlowServices::ProcedureTemplateUpdater.new({procedure_template_params: update_procedure_template_params, user_id: current_user.id, procedure_id: @procedure_template.id})

      authorize! :update, procedure_template_updater.procedure_template

      procedure_template = procedure_template_updater.call
  
      render json: procedure_template, serializer: ProcedureTemplateSerializer::Show, status: :ok
    end

    def destroy
      authorize! :destroy, @procedure_template
      @procedure_template.discard

      render json: @procedure_template, serializer: ProcedureTemplateSerializer::Show, status: :ok
    end

    def activate
      authorize! :update, @procedure_template
      @procedure_template.activate!

      render json: @procedure_template, serializer: ProcedureTemplateSerializer::Show, status: :ok
    end

    def deactivate
      authorize! :update, @procedure_template
      @procedure_template.deactivate!

      render json: @procedure_template, serializer: ProcedureTemplateSerializer::Show, status: :ok
    end

    private

    def create_procedure_template_params
      params.require(:procedure_template).permit(:organization_id, :description, :name)
    end

    def update_procedure_template_params
      params.require(:procedure_template).permit(:description, :name)
    end
  
    def filter_params
      params.permit(:organization_id, statuses: [])
            .with_defaults(statuses: Activable::STATUSES.keys)
    end

    def order_params
      params.permit(:order, :direction)
    end

    def set_procedure_template
      @procedure_template = Flow::ProcedureTemplate.kept.find(params[:id] || params[:procedure_template_id])
      authorize! :read, @procedure_template
    end
  end
end
