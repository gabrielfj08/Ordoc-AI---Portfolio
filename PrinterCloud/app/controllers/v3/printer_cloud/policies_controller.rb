module V3
  module PrinterCloud
    class PoliciesController < BaseController
      before_action :set_policy,
                    only: %i[show update destroy attach_policy_to_user_groups attach_policy_to_user]

      def index
        policies = @organization.policies
                                .includes(:organization)
                                .accessible_by_user(current_user)
                                .filter_by(filter_params)
                                .search_by(params[:q])
                                .order_by(order_params)
                                .paginate(page: params[:page], per_page: params[:per_page])

        render json: policies, meta: { total: policies.total_entries },
               each_serializer: V3::PolicySerializer::List, adapter: :json, status: :ok
      end

      def show
        authorize :read, @policy
        render json: @policy, serializer: V3::PolicySerializer::Show, status: :ok
      end

      def create
        @policy = ::PrinterCloud::Policy.new(create_params)
        @policy.generate_prn
        authorize :create, @policy
        @policy = ::PrinterCloudServices::PolicyCreator.new({ create_params: create_params,
                                                              action_ids: params[:policy][:action_ids] }).call

        render json: @policy, serializer: V3::PolicySerializer::Show, status: :created
      end

      def update
        authorize :update, @policy
        @policy = ::PrinterCloudServices::PolicyUpdater.new({ policy: @policy,
                                                              update_params: update_params,
                                                              action_ids: params[:policy][:action_ids] }).call

        render json: @policy, serializer: V3::PolicySerializer::Show, status: :ok
      end

      def destroy
        authorize :delete, @policy
        ActiveRecord::Base.no_touching do
          @policy.destroy!
        end

        render json: @policy, serializer: V3::PolicySerializer::Show, status: :ok
      end

      def attach_policy_to_user
        user = @organization.printer_cloud_users.active.find_by!(id: params[:user_id])

        authorize :attach_policy_to_user, user
        @policy.users << user

        render json: @policy, serializer: V3::PolicySerializer::Show, status: :ok
      end

      def attach_policy_to_user_groups
        user_groups = @organization.user_groups.active.where(id: params[:user_group_ids])

        user_groups.each do |user_group|
          authorize :attach_policy_to_group, user_group
          @policy.user_groups << user_group
        end

        render json: @policy, serializer: V3::PolicySerializer::Show, status: :ok
      end

      private

      def create_params
        params.require(:policy)
              .permit(:name, :description, :effect, :service, resource: [])
              .merge(source: :customer_managed, organization_id: @organization.id)
      end

      def filter_params
        params.permit(:organization_id, :user_group_id, :public, :user_id, source: [])
      end

      def order_params
        params.permit(:order, :direction)
      end

      def set_policy
        @policy = @organization.policies.find(params[:id] || params[:policy_id])
      end

      def update_params
        params.require(:policy).permit(:effect, :description, :service, resource: [])
      end
    end
  end
end
