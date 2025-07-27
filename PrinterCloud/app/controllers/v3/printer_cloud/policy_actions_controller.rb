module V3
  module PrinterCloud
    class PolicyActionsController < BaseController
      def index
        policy_actions = ::PrinterCloud::PolicyAction.filter_by(filter_params)
                                                     .order_by(order_params)
                                                     .paginate(page: params[:page], per_page: params[:per_page])

        render json: policy_actions, meta: { total: policy_actions.total_entries },
               each_serializer: V3::PolicyActionSerializer::List, adapter: :json, status: :ok
      end

      private

      def filter_params
        params.permit(:resource, access_level: [], service: [])
      end

      def order_params
        params.permit(:order, :direction)
      end
    end
  end
end
