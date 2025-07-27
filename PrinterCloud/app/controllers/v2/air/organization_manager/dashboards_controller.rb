module V2
  module Air
    module OrganizationManager
      class DashboardsController < BaseController
        def active_users_count
          render json: { data: @organization.active_users.count }, status: :ok
        end

        def managers_count
          render json: { data: @organization.managers.count }, status: :ok
        end

        def used_storage
          render json: { data: @organization.used_storage }, status: :ok
        end
      end
    end
  end
end
