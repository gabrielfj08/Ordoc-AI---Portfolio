module V3
  module PrinterFlow
    class TaskAttachmentsController < BaseController
      before_action :set_attachment, only: %i[show destroy]
      load_ability :task_attachment

      def index
        task_attachments = ::PrinterFlow::TaskAttachment.includes(:attachable)
                                                        .accessible_by(current_ability)
                                                        .filter_by(filter_params)
                                                        .order_by(order_params)
                                                        .paginate(page: params[:page], per_page: params[:per_page])

        render json: task_attachments, meta: { total: task_attachments.total_entries },
               each_serializer: V3::TaskAttachmentSerializer::List, adapter: :json, status: :ok
      end

      def show
        authorize! :read, @attachment

        render json: @attachment, serializer: V3::TaskAttachmentSerializer::Show, status: :ok
      end

      def create
        attachment = ::PrinterFlow::TaskAttachment.new(task_id: params[:task_id])
        authorize! :create, attachment

        batch_operation = ::PrinterFlowServices::BatchOperationCreator.new(action: 'create_task_attachment',
                                                                           record_type: 'PrinterFlow::TaskAttachment',
                                                                           payload: {
                                                                             "procedure_document_ids": params[:procedure_document_ids],
                                                                             "task_document_ids": params[:task_document_ids]
                                                                           },
                                                                           created_by: current_user,
                                                                           ids: [params[:task_id]]).call

        render json: batch_operation, serializer: ::V3::BatchOperationSerializer::Show, status: :ok
      end

      def destroy
        authorize! :destroy, @attachment

        @attachment.destroy!

        render json: @attachment, serializer: V3::TaskAttachmentSerializer::Show, status: :ok
      end

      private

      def set_attachment
        @attachment = ::PrinterFlow::TaskAttachment.find(params[:id] || params[:attachment_id])
      end

      def filter_params
        Attachable.map_params(params.permit(:attachable_type,
                                            :attachable_id, :task_id))
      end

      def order_params
        params.permit(:order, :direction)
      end

      def create_params
        Attachable.map_params(params.require(:task_attachment).permit(:attachable_id, :attachable_type, :task_id))
      end
    end
  end
end
