module V3
  module PrinterCloud
    class AppsController < BaseController
      before_action :set_app, only: %i[update]

      def index
        apps = App.filter_by(filter_params)
                  .order_by(order_params)

        render json: apps.paginate(page: params[:page]), each_serializer: ::V3::AppSerializer::List, status: :ok
      end

      def create
        raise Error::PrinterCloud::ForbiddenError unless current_user.admin

        app = App.create!(app_params)

        render json: app, serializer: ::V3::AppSerializer::Show, status: :created
      end

      def update
        raise Error::PrinterCloud::ForbiddenError unless current_user.admin

        @app.update!(update_params)

        render json: @app, serializer: ::V3::AppSerializer::Show, status: :ok
      end

      private

      def filter_params
        params.permit(:organization_id)
      end

      def order_params
        params.permit(:order, :direction)
      end

      def set_app
        @app = App.find(params[:id])
      end

      def app_params
        params.require(:app).permit(:name, :description, :logo, :service)
      end

      def update_params
        params.require(:app).permit(:logo)
      end
    end
  end
end
