module V3
  module PrinterFlow
    module External
      class SharedProceduresController < BaseController
        before_action :set_shared_procedure, only: %i[accept refuse destroy]
        load_ability :shared_procedure

        def index
          shared_procedures = @organization.shared_procedures
                                           .accessible_by(current_ability)
                                           .includes(:created_by)
                                           .includes(:procedure)
                                           .includes(:external_requester)
                                           .filter_by(filter_params)
                                           .order_by(order_params)
                                           .paginate(page: params[:page], per_page: params[:per_page])

          render json: shared_procedures, meta: { total: shared_procedures.total_entries },
                 each_serializer: ::V3::External::SharedProcedureSerializer::List, adapter: :json, root: 'printer_flow/shared_procedures', status: :ok
        end

        def create
          shared_procedure = ::PrinterFlowServices::External::ProcedureSharer.new(create_params).call

          authorize! :create, shared_procedure

          shared_procedure.save!

          render json: shared_procedure, serializer: ::V3::External::SharedProcedureSerializer::Show, status: :ok
        end

        def accept
          authorize! :update, @shared_procedure

          @shared_procedure.accept!

          render json: @shared_procedure, serializer: ::V3::External::SharedProcedureSerializer::Show, status: :ok
        end

        def refuse
          authorize! :update, @shared_procedure

          shared_procedure = ::PrinterFlowServices::External::SharedProcedureRefuser.new({ shared_procedure: @shared_procedure,
                                                                                           created_by: current_user,
                                                                                           note: params[:note],
                                                                                           action: params[:action] }).call

          render json: shared_procedure, serializer: ::V3::External::SharedProcedureSerializer::Show, status: :ok
        end

        def destroy
          authorize! :destroy, @shared_procedure

          @shared_procedure.destroy!

          render json: @shared_procedure, serializer: ::V3::External::SharedProcedureSerializer::Show, status: :ok
        end

        private

        def set_shared_procedure
          @shared_procedure = @organization.shared_procedures.find(params[:id] || params[:shared_procedure_id])
        end

        def create_params
          params.require(:shared_procedure).permit(:cpf_cnpj,
                                                   :procedure_id).merge!(created_by: current_user)
        end

        def filter_params
          params.permit(:external_requester_id, :procedure_id, :created_by_id, status: [])
        end

        def order_params
          params.permit(:order, :direction)
        end
      end
    end
  end
end
