module V2
  module PrinterCloud
    module Admin
      class OrganizationManagersController < BaseController
        before_action :set_role, only: [:destroy]

        def index
          managers = User.organization_manager
                         .filter_by(filter_params)
                         .paginate(page: params[:page])

          render json: managers, meta: { total: managers.total_entries }, each_serializer: ::Admin::UserSerializer::List, adapter: :json, status: :ok
        end

        def destroy
          @role.destroy!

          render json: @role, serializer: ::Admin::RoleSerializer::Show, status: :ok
        end

        private

        def filter_params
          params.permit(:organization_id)
        end

        def set_role
          @role = Role.find_by!(organization_id: params[:organization_id], user_id: params[:id], type: Roles::ORGANIZATION_MANAGER)
        end
      end
    end
  end
end
