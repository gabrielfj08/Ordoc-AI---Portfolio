module V3
  module PrinterFlow
    class RequestersController < BaseController
      before_action :set_requester, only: %i[show update activate deactivate]

      def index
        requesters = @organization.requesters
                                  .preload(:justification_notes)
                                  .accessible_by_user(current_user)
                                  .filter_by(filter_params)
                                  .search_by(params[:q])
                                  .order_by(order_params)
                                  .paginate(page: params[:page], per_page: params[:per_page])

        render json: requesters, meta: { total: requesters.total_entries },
               each_serializer: ::V3::RequesterSerializer::List, adapter: :json, root: 'printer_flow/requesters', status: :ok
      end

      def show
        authorize :read, @requester

        render json: @requester, include: %w[justification_notes.created_by address user],
               serializer: ::V3::RequesterSerializer::Show, status: :ok
      end

      def update
        authorize :update, @requester

        requester = ::PrinterFlowServices::RequesterUpdator.new({ requester_id: @requester.id,
                                                                  address_params: address_params,
                                                                  update_params: update_params }).call!

        render json: requester, serializer: ::V3::RequesterSerializer::Show, status: :ok
      end

      def activate
        authorize :update, @requester

        @requester.activate!

        render json: @requester, serializer: ::V3::RequesterSerializer::Show, status: :ok
      end

      def deactivate
        authorize :update, @requester

        @requester = ::PrinterFlowServices::RequesterDeactivator.new({ requester: @requester,
                                                                       created_by: current_user.internal_requester,
                                                                       note: params[:note],
                                                                       action: params[:action] }).call

        render json: @requester, serializer: ::V3::RequesterSerializer::Show, status: :ok
      end

      private

      def set_requester
        @requester = @organization.requesters.find(params[:id] || params[:requester_id])
      end

      def address_params
        params.require(:address).permit(:street, :number, :complement, :postal_code, :city, :state, :neighborhood)
      end

      def update_params
        params.permit(:name, :email, :phone, :optional_phone, :birth_date, :optional_email, :occupation)
      end

      def filter_params
        Requester.map_params(params.permit(:user_id, :status, :procedure_id, :parent_group_id, type: []))
      end

      def order_params
        params.permit(:order, :direction)
      end
    end
  end
end
