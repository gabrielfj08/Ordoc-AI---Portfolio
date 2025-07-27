module V3
  module PrinterCloud
    class OrganizationsController < BaseController
      def index
        @organizations = ::Organization.where(subdomain: request.headers['X-Api-Subdomain'])

        render json: @organizations, meta: { total: @organizations.count },
               each_serializer: ::V3::OrganizationSerializer::List, adapter: :json, status: :ok
      end

      def show
        render json: @organization, serializer: ::V3::OrganizationSerializer::Show, status: :ok
      end

      def update
        authorize :update, @organization
        @organization = PrinterCloudServices::OrganizationUpdater.new({ organization_id: @organization.id,
                                                                        update_params: update_params,
                                                                        address_params: address_params }).call

        render json: @organization, serializer: ::V3::OrganizationSerializer::Show, status: :ok
      end

      def activate
        raise Error::PrinterCloud::ForbiddenError unless current_user.admin

        @organization.activate!

        render json: @organization, serializer: ::V3::OrganizationSerializer::Show, status: :ok
      end

      def deactivate
        raise Error::PrinterCloud::ForbiddenError unless current_user.admin

        @organization.deactivate!

        render json: @organization, serializer: ::V3::OrganizationSerializer::Show, status: :ok
      end

      def destroy
        raise Error::PrinterCloud::ForbiddenError unless current_user.admin

        @organization.destroy!

        render json: @organization, serializer: ::V3::OrganizationSerializer::Show, status: :ok
      end

      private

      def address_params
        params.require(:address).permit(:street, :number, :complement, :postal_code, :city, :state, :neighborhood)
      end

      def filter_params
        params.permit(:user_id, status: [])
      end

      def order_params
        params.permit(:order, :direction)
      end

      def create_params
        params.require(:organization)
              .permit(:corporate_name, :email, :phone, :site, :cnpj, :contact_name, :contact_phone, :logo_url, :subdomain)
              .merge!(created_by_id: current_user.id)
      end

      def update_params
        params.require(:organization).permit(:corporate_name, :email, :phone, :site, :contact_name,
                                             :contact_phone, :logo_url, :storage_limit, app_ids: [])
      end
    end
  end
end
