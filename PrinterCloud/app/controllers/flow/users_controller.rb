module Flow
  class UsersController < BaseController
    before_action :set_user_group
    load_ability :user, :user_group

    def index
      @users = @user_group.users
                          .accessible_by(current_ability)

      render json: @users, status: :ok
    end

    private

    def set_user_group
      @user_group = UserGroup.find(params[:user_group_id])

      authorize! :read, @user_group
    end
  end
end
