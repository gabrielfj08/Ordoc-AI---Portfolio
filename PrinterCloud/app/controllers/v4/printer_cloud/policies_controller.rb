module V4
  module PrinterCloud
    class PoliciesController < BaseController
      def attach_policy_to_users
        users = @organization.printer_cloud_users.active.where(id: params[:user_ids])
        authorize_batch :attach_policy_to_user, users, UnauthorizedMessages.attach_policy_to_users

        batch_operation = ::PrinterCloudServices::BatchOperationCreator.new(action: 'attach_policy_to_users',
                                                                            record_type: 'PrinterCloud::Policy',
                                                                            payload: { "policy_id": params[:policy_id] },
                                                                            created_by: current_user,
                                                                            ids: users.pluck(:id)).call

        render json: batch_operation, serializer: ::V4::BatchOperationSerializer::Show, status: :ok
      end

      def attach_policy_to_user_groups
        user_groups = @organization.user_groups.active.where(id: params[:user_group_ids])

        authorize_batch :attach_policy_to_group, user_groups, UnauthorizedMessages.attach_policy_to_user_groups

        batch_operation = ::PrinterCloudServices::BatchOperationCreator.new(action: 'attach_policy_to_user_groups',
                                                                            record_type: 'PrinterCloud::Policy',
                                                                            payload: { "policy_id": params[:policy_id] },
                                                                            created_by: current_user,
                                                                            ids: user_groups.pluck(:id)).call

        render json: batch_operation, serializer: ::V4::BatchOperationSerializer::Show, status: :ok
      end
    end
  end
end
