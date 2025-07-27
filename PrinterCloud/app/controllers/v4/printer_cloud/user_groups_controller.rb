module V4
  module PrinterCloud
    class UserGroupsController < BaseController
      before_action :set_user_group, only: %i[add_users_to_group attach_policies_to_group]

      def add_users_to_group
        authorize :attach_user_to_group, @user_group

        batch_operation = ::PrinterCloudServices::BatchOperationCreator.new(action: 'add_users_to_group',
                                                                            record_type: 'PrinterCloud::UserGroup',
                                                                            payload: { "user_group_id": @user_group.id },
                                                                            created_by: current_user,
                                                                            ids: params[:user_ids]).call

        render json: batch_operation, serializer: ::V4::BatchOperationSerializer::Show, status: :ok
      end

      def attach_policies_to_group
        authorize :attach_policy_to_group, @user_group

        batch_operation = ::PrinterCloudServices::BatchOperationCreator.new(action: 'attach_policies_to_group',
                                                                            record_type: 'PrinterCloud::UserGroup',
                                                                            payload: { "user_group_id": @user_group.id },
                                                                            created_by: current_user,
                                                                            ids: params[:policy_ids]).call

        render json: batch_operation, serializer: ::V4::BatchOperationSerializer::Show, status: :ok
      end

      private

      def set_user_group
        @user_group = @organization.user_groups.active.find(params[:id] || params[:user_group_id])
      end
    end
  end
end
