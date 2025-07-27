module Manager
  class ManagersController < BaseController
    before_action :authenticate_manager!

    private

    def authenticate_manager!
      raise Error::NotManagerError unless current_user.organization_manager?
    end
  end
end
