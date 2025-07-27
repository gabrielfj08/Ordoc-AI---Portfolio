module V3
  module PrinterFlow
    class RequesterInfosController < BaseController
      before_action :set_requester, only: %i[create show]
      before_action :set_requester_info, only: %i[show]

      def create
        authorize :read, @requester
        @requester_info = @requester.requester_infos.create!(created_by_id: current_user.id)

        render json: @requester_info, serializer: V3::RequesterInfoSerializer::Show, status: :created
      end

      def show
        authorize :read, @requester
        render json: @requester_info, serializer: V3::RequesterInfoSerializer::Show, status: :ok
      end

      private

      def set_requester_info
        @requester_info = @requester.requester_infos.find(params[:id])
      end

      def set_requester
        @requester = ::PrinterFlow::Requester.find(params[:requester_id])
      end
    end
  end
end
