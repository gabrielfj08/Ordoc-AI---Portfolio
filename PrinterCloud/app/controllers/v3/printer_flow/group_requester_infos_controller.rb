module V3
  module PrinterFlow
    class GroupRequesterInfosController < BaseController
      before_action :set_group_requester, only: %i[create show]
      before_action :set_group_requester_info, only: %i[show]

      def create
        authorize :read, @group_requester
        @group_requester_info = @group_requester.group_requester_infos.create!(created_by_id: current_user.id)

        render json: @group_requester_info, serializer: V3::GroupRequesterInfoSerializer::Show, status: :created
      end

      def show
        authorize :read, @group_requester
        render json: @group_requester_info, serializer: V3::GroupRequesterInfoSerializer::Show, status: :ok
      end

      private

      def set_group_requester_info
        @group_requester_info = @group_requester.group_requester_infos.find(params[:id])
      end

      def set_group_requester
        @group_requester = ::PrinterFlow::GroupRequester.find(params[:group_requester_id])
      end
    end
  end
end
