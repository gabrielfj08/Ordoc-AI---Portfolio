module V2
  module PrinterCloud
    module Admin
      class DepartmentMembersController < BaseController
        def index
          members = User.department_member
                        .filter_by(filter_params)
                        .paginate(page: params[:page])

          render json: members, meta: { total: members.total_entries }, each_serializer: ::Admin::UserSerializer::List, adapter: :json, status: :ok
        end

        private

        def filter_params
          params.permit(:department_id)
        end
      end
    end
  end
end
