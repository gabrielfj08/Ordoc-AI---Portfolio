module V3
  module PrinterCloud
    class ThemesController < BaseController
      before_action :set_theme, only: %i[show update destroy]

      def show
        render json: @theme, serializer: V3::ThemeSerializer::Show, status: :ok
      end

      def create
        raise Error::PrinterCloud::ForbiddenError unless current_user.admin

        theme = ::PrinterCloud::Theme.create!(create_params)

        render json: theme, serializer: V3::ThemeSerializer::Show, status: :created
      end

      def update
        authorize :update, @organization
        @theme.update!(update_params)

        render json: @theme, serializer: V3::ThemeSerializer::Show, status: :ok
      end

      def destroy
        raise Error::PrinterCloud::ForbiddenError unless current_user.admin

        @theme.destroy!

        render json: @theme, serializer: V3::ThemeSerializer::Show, status: :ok
      end

      private

      def set_theme
        @theme = ::PrinterCloud::Theme.find_by!(organization_id: @organization.id)
      end

      def create_params
        params.require(:theme)
              .permit(:image_url, :color, :background_url)
              .merge(organization_id: @organization.id)
      end

      def update_params
        params.require(:theme).permit(:image_url, :color, :background_url)
      end
    end
  end
end
