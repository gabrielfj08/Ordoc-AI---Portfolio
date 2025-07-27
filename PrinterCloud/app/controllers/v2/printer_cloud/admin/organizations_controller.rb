module V2
  module PrinterCloud
    module Admin
      class OrganizationsController < BaseController
        before_action :set_organization, only: %i[show update destroy activate deactivate]

        def index
          organizations = Organization.filter_by(filter_params)
                                      .search_by(params[:q])
                                      .order_by(order_params)
                                      .paginate(page: params[:page])

          render json: organizations, meta: { total: organizations.total_entries },
                 each_serializer: ::Admin::OrganizationSerializer::List, adapter: :json, status: :ok
        end

        def create
          @organization = PrinterCloudServices::OrganizationCreator.new({ create_params: create_params,
                                                                          address_params: address_params }).call

          render json: @organization, serializer: ::Admin::OrganizationSerializer::Show, status: :created
        end

        def show
          render json: @organization, serializer: ::Admin::OrganizationSerializer::Show, status: :ok
        end

        def update
          @organization = PrinterCloudServices::OrganizationUpdater.new({ organization_id: @organization.id,
                                                                          update_params: update_params,
                                                                          address_params: address_params }).call

          render json: @organization, serializer: ::Admin::OrganizationSerializer::Show, status: :ok
        end

        def activate
          @organization.activate!

          render json: @organization, serializer: ::Admin::OrganizationSerializer::Show, status: :ok
        end

        def deactivate
          @organization.deactivate!

          render json: @organization, serializer: ::Admin::OrganizationSerializer::Show, status: :ok
        end

        def destroy
          @organization.destroy!

          render json: @organization, serializer: ::Admin::OrganizationSerializer::Show, status: :ok
        end

        private

        def address_params
          params.require(:address).permit(:street, :number, :complement, :postal_code, :city, :state, :neighborhood)
        end

        def filter_params
          params.permit(status: [])
        end

        def order_params
          params.permit(:order, :direction)
        end

        def create_params
          params.require(:organization)
                .permit(:corporate_name, :email, :phone, :site, :cnpj, :contact_name, :contact_phone, :logo, :subdomain)
                .merge!(created_by_id: current_user.id)
        end

        def update_params
          params.require(:organization).permit(:corporate_name, :email, :phone, :site, :contact_name, :contact_phone,
                                               :logo, :storage_limit, app_ids: [])
        end

        def set_organization
          @organization = Organization.find(params[:organization_id] || params[:id])
        end
      end
    end
  end
end
