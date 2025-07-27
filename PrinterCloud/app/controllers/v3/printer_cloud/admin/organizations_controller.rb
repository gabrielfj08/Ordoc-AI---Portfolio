module V3
  module PrinterCloud
    module Admin
      class OrganizationsController < BaseController
        before_action :authorize

        def create
          @organization = PrinterCloudServices::OrganizationCreator.new({ create_params: create_params,
                                                                          address_params: address_params }).call

          render json: @organization, serializer: ::V3::OrganizationSerializer::Show, status: :created
        end

        def set_up
          @organization = PrinterCloudServices::OrganizationSetterUp.new(set_up_params).call!

          render json: @organization, serializer: ::V3::OrganizationSerializer::Show, status: :ok
        end

        private

        def authorize
          raise Error::PrinterCloud::ForbiddenError unless current_user.admin
        end

        def address_params
          params.require(:address).permit(:street, :number, :complement, :postal_code, :city, :state, :neighborhood)
        end

        def create_params
          params.require(:organization)
                .permit(:corporate_name, :email, :phone, :site, :cnpj, :contact_name, :contact_phone, :logo_url,
                        :storage_limit, :subdomain)
                .merge!(created_by_id: current_user.id)
        end

        def set_up_params
          params.require(:organization).permit(:user_id, apps: []).merge!(organization_id: params[:organization_id])
        end
      end
    end
  end
end
