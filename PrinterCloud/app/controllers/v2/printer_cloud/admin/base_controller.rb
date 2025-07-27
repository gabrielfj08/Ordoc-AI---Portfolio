module V2
  module PrinterCloud
    module Admin
      class BaseController < ::BaseController
        before_action :authorize
  
        def healthcheck
          render json: { status: :available }, status: :ok
        end

        private
  
        def authorize
          raise Error::PrinterCloud::ForbiddenError unless User.admin.pluck(:id).include?(current_user.id)
        end
      end
    end
  end
end
  