module V2
  module PrinterCloud
    module Admin
      class DepartmentsController < BaseController
        def index
          departments = Department.filter_by(filter_params)
                        .paginate(page: params[:page])

          render json: departments, meta: { total: departments.total_entries}, each_serializer: ::Admin::DepartmentSerializer::List, adapter: :json, status: :ok
        end

        private

        def filter_params
          params.permit(:organization_id)
        end
      end
    end
  end
end
