module V3
  module PrinterCloud
    class DecreesController < BaseController
      before_action :set_decree, only: %i[show update destroy]

      def show
        render json: @decree, serializer: ::V3::DecreeSerializer::Show, status: :ok
      end

      def create
        authorize :update, @organization
        decree = @organization.create_decree!(create_params)

        render json: decree, serializer: ::V3::DecreeSerializer::Show, status: :created
      end

      def update
        authorize :update, @organization
        @decree.update!(update_params)

        render json: @decree, serializer: ::V3::DecreeSerializer::Show, status: :ok
      end

      def destroy
        authorize :update, @organization
        @decree.destroy!

        render json: @decree, serializer: ::V3::DecreeSerializer::Show, status: :ok
      end

      private

      def set_decree
        @decree = ::PrinterCloud::Decree.find_by!(organization_id: @organization.id)
      end

      def create_params
        params.require(:decree)
              .permit(:decree_number, :decree_date, :decree_url, :law_number, :law_date, :law_url, :body)
      end

      def update_params
        params.require(:decree)
              .permit(:decree_number, :decree_date, :decree_url, :law_number, :law_date, :law_url, :body)
      end
    end
  end
end
