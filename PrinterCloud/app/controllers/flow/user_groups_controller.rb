module Flow
  class UserGroupsController < BaseController
    before_action :set_user_group, only: [:show, :update, :destroy, :activate, :deactivate, :set_users, :restore]
    load_ability :user, :user_group
  
    def index
      @user_groups = Flow::UserGroup.kept
                                    .filter_by(filter_params)
                                    .order_by(order_params)
                                    .search_by(params[:q])
                                    .accessible_by(current_ability)
                                    .paginate(page: params[:page])

      render json: @user_groups, each_serializer: UserGroupSerializer::List, status: :ok
    end
  
    def show
      render json: @user_group, serializer: UserGroupSerializer::Show, status: :ok
    end
  
    def create
      @user_group = Flow::UserGroup.new(create_user_group_params)
      authorize! :create, @user_group
      @user_group.save!
  
      render json: @user_group, serializer: UserGroupSerializer::Show, status: :created
    end
  
    def update
      authorize! :update, @user_group
      @user_group.update!(update_user_group_params)

      render json: @user_group, serializer: UserGroupSerializer::Show, status: :ok
    end
  
    def destroy
      authorize! :destroy, @user_group
      @user_group.discard

      render json: @user_group, serializer: UserGroupSerializer::Show, status: :ok
    end

    def activate
      authorize! :activate, @user_group
      @user_group.activate!

      render json: @user_group, serializer: UserGroupSerializer::Show, status: :ok
    end

    def deactivate
      authorize! :update, @user_group
      @user_group.deactivate!

      render json: @user_group, serializer: UserGroupSerializer::Show, status: :ok
    end

    def restore
      authorize! :update, @user_group
      @user_group.restore

      render json: @user_group, serializer: UserGroupSerializer::Show, status: :ok
    end

    def set_users
      authorize! :update, @user_group
      users = User.where(id: params[:user_ids])

      users.each do |user|
        authorize! :read, user
        raise Error::UserCannotJoinUserGroupError unless Organization.filter_by_department_member_id(user.id).include?(@user_group.organization)
      end

      @user_group.users = users

      render json: @user_group, serializer: UserGroupSerializer::Show, status: :ok
    end
    
    def add_members
      authorize! :update, @user_group
      @user_group.users.push(User.where(id: user_ids.delete_if{|item| @user_group.user_ids.include? item}))

      render json: @user_group, serializer: UserGroupSerializer::Show, status: :ok
    end
    
    def remove_members
      authorize! :update, @user_group
      @user_group.users.delete(User.where(id: user_ids))

      render json: @user_group, serializer: UserGroupSerializer::Show, status: :ok
    end
  
    private

    def order_params
      params.permit(:order, :direction)
    end

    def filter_params
      params.permit(:name, :organization_id, :status)
    end

    def set_user_group
      @user_group = Flow::UserGroup.kept.find(params[:id] || params[:user_group_id])
      authorize! :read, @user_group
    end
  
    def create_user_group_params
      params.require(:user_group).permit(:name, :notes, :organization_id)
    end

    def update_user_group_params
      params.require(:user_group).permit(:name, :notes)
    end
  end
end
