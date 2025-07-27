module Member
  class AppsController < BaseController
    before_action :set_organization, only: [:index]

    def index
      @apps = @organization.apps.accessible_by(current_ability)
                                .order_by(order_params)
      render json: @apps, status: :ok
    end

    private

    def set_organization
      @organization = Organization.find(params[:organization_id])

      authorize! :read, @organization
    end

    def current_ability
      OrganizationMemberAbility.new(current_user)
    end

    def order_params
      params.permit(:order, :direction)
    end
  end
end
