module V3
  module PrinterFlow
    class GroupRequestersController < BaseController
      before_action :set_group_requester,
                    only: %i[show update index_requesters_from_group tree add_requester remove_requester]

      def index
        group_requesters = @organization.group_requesters
                                        .accessible_by_user(current_user)
                                        .filter_by(filter_params)
                                        .search_by(params[:q])
                                        .order_by(order_params)
                                        .paginate(page: params[:page], per_page: params[:per_page])

        render json: group_requesters, meta: { total: group_requesters.total_entries },
               each_serializer: ::V3::GroupRequesterSerializer::List, adapter: :json, status: :ok
      end

      def index_requesters_from_group
        requesters = @group_requester.internal_requesters
                                     .search_by(params[:q])
                                     .order_by(order_params)
                                     .paginate(page: params[:page], per_page: params[:per_page])

        render json: requesters, meta: { total: requesters.total_entries },
               each_serializer: ::V3::RequesterSerializer::List, adapter: :json, status: :ok
      end

      def show
        authorize :read, @group_requester

        render json: @group_requester,
               serializer: ::V3::GroupRequesterSerializer::Show, status: :ok
      end

      def create
        @group_requester = ::PrinterFlow::GroupRequester.new(create_params)
        @group_requester.generate_prn

        authorize :create, @group_requester

        @group_requester = PrinterFlowServices::GroupRequesterCreator.new(create_params).call

        render json: @group_requester, serializer: ::V3::GroupRequesterSerializer::Show, status: :created
      end

      def update
        authorize :update, @group_requester

        @group_requester.update!(update_params)

        render json: @group_requester, serializer: ::V3::RequesterSerializer::Show, status: :ok
      end

      def tree
        authorize :read, @group_requester

        render json: @group_requester, serializer: ::V3::RequesterSerializer::Tree, include: '**', status: :ok
      end

      def add_requester
        authorize :add_requester_to_group, @group_requester

        batch_operation = ::PrinterFlowServices::BatchOperationCreator.new(action: 'add_requester_to_group',
                                                                           record_type: 'PrinterFlow::GroupRequester',
                                                                           payload: { "group_requester_id": params[:group_requester_id] },
                                                                           created_by: current_user,
                                                                           ids: params[:requester_ids]).call

        render json: batch_operation, serializer: ::V3::BatchOperationSerializer::Show, status: :ok
      end

      def remove_requester
        authorize :remove_requester_from_group, @group_requester

        user_id = ::PrinterFlow::InternalRequester.find(params[:requester_id]).user.id
        @group_requester.users.delete(user_id)

        render json: @group_requester, serializer: ::V3::GroupRequesterSerializer::Show, status: :ok
      end

      private

      def set_group_requester
        @group_requester = @organization.group_requesters.find(params[:id] || params[:group_requester_id])
      end

      def create_params
        params.require(:group_requester)
              .permit(:name, :parent_group_id)
              .merge!(organization_id: @organization.id)
      end

      def update_params
        params.permit(:name)
      end

      def filter_params
        params.permit(:type, :status, :parent_group_id, :user_id)
      end

      def order_params
        params.permit(:order, :direction)
      end
    end
  end
end
