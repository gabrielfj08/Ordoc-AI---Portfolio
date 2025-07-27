module V3
  module PrinterCloud
    class UserGroupsController < BaseController
      before_action :set_user_group,
                    only: %i[show update destroy activate deactivate add_user remove_user detach_policy]

      def index
        user_groups = @organization.user_groups.includes(:organization)
                                   .includes(:users)
                                   .includes(:policies)
                                   .accessible_by_user(current_user)
                                   .filter_by(filter_params)
                                   .order_by(order_params)
                                   .search_by(params[:q])
                                   .paginate(page: params[:page], per_page: params[:per_page])

        render json: user_groups, meta: { total: user_groups.total_entries },
               each_serializer: V3::UserGroupSerializer::List, adapter: :json, status: :ok
      end

      def show
        authorize :read, @user_group
        render json: @user_group, serializer: V3::UserGroupSerializer::Show, status: :ok
      end

      def create
        @user_group = ::PrinterCloud::UserGroup.new(create_params)
        @user_group.generate_prn
        authorize :create, @user_group
        @user_group.save!

        render json: @user_group, serializer: V3::UserGroupSerializer::Show, status: :created
      end

      def update
        authorize :update, @user_group
        @user_group.update!(update_params)

        render json: @user_group, serializer: V3::UserGroupSerializer::Show, status: :ok
      end

      def destroy
        authorize :delete, @user_group

        @user_group.destroy!

        render json: @user_group, serializer: V3::UserGroupSerializer::Show, status: :ok
      end

      def activate
        authorize :update, @user_group
        @user_group.activate!

        render json: @user_group, serializer: V3::UserGroupSerializer::Show, status: :ok
      end

      def deactivate
        authorize :update, @user_group
        @user_group.deactivate!

        render json: @user_group, serializer: V3::UserGroupSerializer::Show, status: :ok
      end

      def add_user
        authorize :attach_user_to_group, @user_group
        user = ::PrinterCloud::User.kept.find_by_id!(params[:user_id])
        @user_group.users << user
        @user_group.touch

        render json: @user_group, serializer: V3::UserGroupSerializer::Show, status: :ok
      end

      def remove_user
        user = @organization.printer_cloud_users.find(params[:user_id])

        authorize :detach_user_from_group, @user_group
        @user_group.users.delete(user)

        render json: @user_group, serializer: V3::UserGroupSerializer::Show, status: :ok
      end

      def attach_policy
        user_group = @organization.user_groups.active.find(params[:user_group_id])

        authorize :attach_policy_to_group, user_group
        policies = ::PrinterCloud::Policy.where(id: params[:policy_ids])
        user_group.policies << policies

        render json: user_group, serializer: V3::UserGroupSerializer::Show, status: :ok
      end

      def detach_policy
        authorize :detach_policy_from_group, @user_group
        @user_group.policies.delete(params[:policy_id])

        render json: @user_group, serializer: V3::UserGroupSerializer::Show, status: :ok
      end

      private

      def create_params
        params.require(:user_group).permit(:name, :description).merge(organization_id: @organization.id)
      end

      def filter_params
        params.permit(:organization_id, :user_id, :policy_id, status: [])
      end

      def order_params
        params.permit(:order, :direction)
      end

      def set_user_group
        @user_group = @organization.user_groups.find(params[:id] || params[:user_group_id])
      end

      def update_params
        params.require(:user_group).permit(:name, :description)
      end
    end
  end
end
