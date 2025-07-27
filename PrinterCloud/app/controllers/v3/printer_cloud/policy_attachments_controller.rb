module V3
  module PrinterCloud
    class PolicyAttachmentsController < BaseController
      before_action :set_policy, only: [:index]
      before_action :authorize

      def index
        policy_attachments = @policy.policy_attachments

        render json: policy_attachments, meta: { total: policy_attachments.count },
               each_serializer: V3::PolicyAttachmentSerializer::List, adapter: :json, status: :ok
      end

      private

      def authorize
        raise Error::PrinterCloud::ForbiddenError unless current_user.email.include?('@printerdobrasil')
      end

      def set_policy
        @policy = ::PrinterCloud::Policy.find(params[:id] || params[:policy_id])
      end
    end
  end
end
