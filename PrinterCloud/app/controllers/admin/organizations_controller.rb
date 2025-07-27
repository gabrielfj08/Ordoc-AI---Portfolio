module Admin
  class OrganizationsController < AdminsController
    before_action :set_organization, only: [:show, :update, :destroy, :add_logo]
    
    def index
      organizations = Organization.accessible_by(current_ability)
                                  .filter_by(filter_params)
                                  .search_by(params[:q])
                                  .order_by(order_params)
                                  .paginate(page: params[:page])

      render json: organizations, each_serializer: ::OrganizationSerializer::List, status: :ok
    end

    def show
      authorize! :read, @organization

      render json: @organization, serializer: ::OrganizationSerializer::Show, status: :ok
    end

    def create
      ActiveRecord::Base.transaction do
        organization = Organization.new(organization_params)
        authorize! :create, organization
        organization.save!
        organization.create_address(address_params[:address])
        organization.create_recycle_bin

        render json: organization, status: :created
      end
    end

    def update
      authorize! :update, @organization
      @organization.update!(organization_params)
      @organization.address.update!(address_params[:address])
      apps_ids = app_params.map do |app|
        app[:id]
      end
      @organization.apps = App.where(id: apps_ids)

      render json: @organization, serializer: ::OrganizationSerializer::Show, status: :ok
    end

    def destroy
      authorize! :destroy, @organization
      @organization.discard

      render json: @organization, serializer: ::OrganizationSerializer::Show, status: :ok
    end

    def restore
      @organization = Organization.discarded.find(params[:organization_id])
      authorize! :update, @organization
      @organization.undiscard

      render json: @organization, serializer: ::OrganizationSerializer::Show, status: :ok
    end

    def really_destroy
      @organization = Organization.discarded.find(params[:organization_id])
      authorize! :destroy, @organization
      @organization.destroy

      render json: @organization, serializer: ::OrganizationSerializer::Show, status: :ok
    end

    def list
      role = role_params[:type]
      if (role == Roles::ORGANIZATION_MANAGER or role == Roles::ORGANIZATION_MEMBER)
        user_id = user_id_param
        organizations = Organization.kept.get_organization_by_role(role, user_id)

        render json: organizations, each_serializer: ::OrganizationSerializer::List, status: :ok
      end
    end

    def index_base
      organizations = Organization.kept.accessible_by(current_ability)

      render json: organizations, each_serializer: ::OrganizationSerializer::Base, status: :ok
    end

    def add_logo
      authorize! :update, @organization
      @organization.logo.attach(params[:logo])

      render json: @organization, serializer: ::OrganizationSerializer::Show, status: :ok
    end

    private

    def app_params
      params.require(:organization).permit({:apps => [:id]})[:apps]
    end

    def address_params
      params.require(:organization).permit({:address => [:street, :number, :complement, :postal_code, :city, :state, :neighborhood]})
    end

    def filter_params
      params.permit(:contact_name, :corporate_name, :cnpj, :email, :site, status: [])
    end

    def order_params
      params.permit(:order, :direction)
    end

    def organization_params
      params.require(:organization)
            .permit(:corporate_name, :email, :phone, :site, :cnpj, :contact_name, :contact_phone)
            .merge!(created_by_id: current_user.id)
    end

    def role_params
      Roles.map_params(params.require(:role).permit(:type))
    end

    def user_id_param
      params[:user_id]
    end

    def set_organization
      @organization = Organization.find(params[:id] || params[:organization_id])
    end

    def current_ability
      @current_ability ||= AdminAbility.new(current_user)
    end
  end
end
