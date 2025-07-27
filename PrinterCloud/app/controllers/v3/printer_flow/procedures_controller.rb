module V3
  module PrinterFlow
    class ProceduresController < BaseController
      before_action :set_group_requester, only: %i[show create update archive unarchive finish]
      before_action :set_procedure, only: %i[show update archive unarchive finish]
      load_ability :procedure

      def index
        procedures = @organization.printer_flow_procedures
                                  .accessible_by(current_ability)
                                  .filter_by(filter_params)
                                  .search_by(params[:q])
                                  .order_by(order_params)
                                  .paginate(page: params[:page], per_page: params[:per_page])

        render json: procedures, meta: { total: procedures.count },
               each_serializer: ::V3::ProcedureSerializer::List, adapter: :json, status: :ok
      end

      def show
        authorize! :read, @procedure
        render json: @procedure, serializer: V3::ProcedureSerializer::Show, status: :ok
      end

      def create
        procedure = ::PrinterFlow::Procedure.new(create_params)
        authorize! :create, procedure

        procedure = ::PrinterFlowServices::ProcedureCreator.new(create_params).call

        render json: procedure, serializer: V3::ProcedureSerializer::Show, status: :created
      end

      def update
        authorize! :update, @procedure
        procedure = ::PrinterFlowServices::ProcedureUpdator.new({ procedure: @procedure,
                                                                  update_params: update_params,
                                                                  current_user: current_user }).call

        render json: procedure, serializer: V3::ProcedureSerializer::Show, status: :ok
      end

      def archive
        authorize! :update, @procedure

        procedure = ::PrinterFlowServices::ProcedureArchiver.new({ procedure: @procedure,
                                                                   created_by: current_user.internal_requester,
                                                                   action: params[:action],
                                                                   note: params[:note] }).call

        render json: procedure, serializer: V3::ProcedureSerializer::Show, status: :ok
      end

      def unarchive
        authorize! :update, @procedure

        procedure = ::PrinterFlowServices::ProcedureUnarchiver.new({ procedure: @procedure,
                                                                     created_by: current_user.internal_requester,
                                                                     action: params[:action],
                                                                     note: params[:note] }).call

        render json: procedure, serializer: V3::ProcedureSerializer::Show, status: :ok
      end

      def finish
        authorize! :update, @procedure
        procedure = ::PrinterFlowServices::ProcedureFinisher.new({ procedure: @procedure,
                                                                   created_by: current_user }).call

        render json: procedure, serializer: V3::ProcedureSerializer::Show, status: :ok
      end

      def count_by_status
        procedures_count = ::PrinterFlow::Procedure.accessible_by(current_ability)
                                                   .filter_by(count_params)
                                                   .count_by_status

        render json: procedures_count, status: :ok
      end

      private

      def create_params
        params.require(:procedure).permit(:procedure_template_id, :requester_id, :priority, :private, :deadline,
                                          :source).merge(organization_id: @organization.id,
                                                         responsible_group_id: @group_requester.id,
                                                         created_by_id: current_user.id)
      end

      def update_params
        params.require(:procedure).permit(:responsible_group_id, :requester_id, :priority, :private, :deadline, :source,
                                          payload: [:label, :field_type, :value, { options: [], value: [] }])
      end

      def set_group_requester
        @group_requester = @organization.group_requesters.find(params[:group_requester_id])
      end

      def set_procedure
        @procedure = @group_requester.procedures.find(params[:procedure_id] || params[:id])
      end

      def filter_params
        params.permit(:created_by_id, :responsible_group_id, :requester_id, private: [], status: [], source: [],
                                                                            priority: [])
      end

      def count_params
        params.permit(:created_by_id, :responsible_group_id)
      end

      def order_params
        params.permit(:order, :direction)
      end
    end
  end
end
