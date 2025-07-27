module V2
  module Air
    module DepartmentMember
      class BaseController < ::BaseController
        before_action :set_department
        before_action :authorize

        def healthcheck
          render json: { status: :available }, status: :ok
        end

        private

        def set_department
          @department = Department.find(params[:department_id] || params[:id])
        end

        def authorize
          raise Error::PrinterCloud::ForbiddenError unless @department.members.pluck(:id).include?(current_user.id) && @department.active?
        end
      end
    end
  end
end
