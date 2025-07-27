module Manager
  class OrganizationsController < ManagersController
    before_action :set_organization, only: [:show]

    def index
      organizations = Organization.accessible_by(current_ability)
                                  .filter_by(filter_params)
                                  .order_by(order_params)
                                  .paginate(page: params[:page])

      render json: organizations, each_serializer: OrganizationManager::OrganizationSerializer::List, status: :ok
    end

    private

    def filter_params
      params.permit(:contact_name, :corporate_name, :cnpj, :email, :site)
    end

    def order_params
      params.permit(:order, :direction)
    end

    def set_organization
      @organization = Organization.find(params[:id])
      authorize! :read, @organization
    end

    def current_ability
      @current_ability ||= ManagerAbility.new(current_user)
    end
  end
end
