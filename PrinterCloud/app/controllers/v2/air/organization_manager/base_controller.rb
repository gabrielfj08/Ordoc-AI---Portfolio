module V2
  module Air
    module OrganizationManager
      class BaseController < ::BaseController
        before_action :set_organization
        before_action :authorize

        def healthcheck
          render json: { status: :available }, status: :ok
        end

        private

        def set_organization
          @organization = Organization.find(params[:organization_id] || params[:id])
        end

        def authorize
          raise Error::PrinterCloud::ForbiddenError unless @organization.managers.pluck(:id).include?(current_user.id) && @organization.active?
        end
      end
    end
  end
end
