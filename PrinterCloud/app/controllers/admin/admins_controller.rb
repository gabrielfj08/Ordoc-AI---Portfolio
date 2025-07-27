module Admin
  class AdminsController < BaseController
    before_action :authenticate_admin!

    private

    def authenticate_admin!
      raise Error::NotAdminError unless current_user.admin?
    end
  end
end
