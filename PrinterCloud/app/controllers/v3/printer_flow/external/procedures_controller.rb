module V3
  module PrinterFlow
    module External
      class ProceduresController < BaseController
        before_action :set_procedure, only: %i[show update run request_to_finish]

        load_ability :procedure

        def index
          procedures = @organization.printer_flow_procedures
                                    .accessible_by(current_ability)
                                    .filter_by(filter_params)
                                    .search_by(params[:q])
                                    .order_by(order_params)
                                    .paginate(page: params[:page], per_page: params[:per_page])

          render json: procedures, meta: { total: procedures.total_entries },
                 each_serializer: ::V3::External::ProcedureSerializer::List, adapter: :json, status: :ok
        end

        def show
          authorize! :read, @procedure

          render json: @procedure, serializer: ::V3::External::ProcedureSerializer::Show, status: :ok
        end

        def create
          procedure = ::PrinterFlow::Procedure.new(create_params)
          authorize! :create, procedure

          procedure = ::PrinterFlowServices::External::ProcedureCreator.new(create_params).call

          render json: procedure, serializer: ::V3::External::ProcedureSerializer::Show, status: :created
        end

        def update
          authorize! :update, @procedure

          @procedure.update!(update_params)

          render json: @procedure, serializer: ::V3::External::ProcedureSerializer::Show, status: :ok
        end

        def run
          authorize! :update, @procedure

          procedure = ::PrinterFlowServices::External::ProcedureRunner.new({ procedure: @procedure }).call

          render json: procedure, serializer: V3::External::ProcedureSerializer::Show, status: :ok
        end

        def request_to_finish
          authorize! :finish, @procedure

          procedure = ::PrinterFlowServices::External::ProcedureFinishRequester.new(procedure: @procedure,
                                                                                    description: params[:description]).call

          render json: procedure, serializer: V3::External::ProcedureSerializer::Show, status: :ok
        end

        private

        def create_params
          params.require(:procedure).permit(:procedure_template_id).merge!(organization_id: @organization.id,
                                                                           created_by_id: ENV['EXTERNAL_USER_ID'],
                                                                           priority: 'normal',
                                                                           private: true,
                                                                           source: 'external',
                                                                           requester_id: current_user.id)
        end

        def update_params
          params.require(:procedure).permit(payload: [:label, :field_type,
                                                      :value, { options: [], value: [] }])
        end

        def set_procedure
          @procedure = @organization.printer_flow_procedures.find(params[:procedure_id] || params[:id])
        end

        def filter_params
          params.permit(:requester_id, :shared_with_requester_id, created_at: %i[gte lte], status: [])
        end

        def order_params
          params.permit(:order, :direction)
        end
      end
    end
  end
end
