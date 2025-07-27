module V3
  module Reports
    class ReportsController < BaseController
      def index
        reports = @organization.reports.accessible_by_user(current_user)
                               .filter_by(filter_params)
                               .order_by(order_params)
                               .paginate(page: params[:page])

        render json: reports, meta: { total: reports.total_entries }, each_serializer: V3::ReportSerializer::List,
               adapter: :json, status: :ok
      end

      private

      def filter_params
        params.permit(:name)
      end

      def order_params
        params.permit(:order, :direction)
      end
    end
  end
end
