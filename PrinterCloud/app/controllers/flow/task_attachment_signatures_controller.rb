module Flow
  class TaskAttachmentSignaturesController < BaseController
    before_action :set_task_attachment, only: [:create, :show, :sign, :refuse, :destroy]
    before_action :set_task_attachment_signature, only: [:show, :destroy, :refuse, :sign]
    load_ability :task_attachment_signature, :task_attachment

    attr_accessor :signature, :procedure

    def index
      @task_attachments_signatures = Flow::TaskAttachmentSignature.all
                                                                  .filter_by(filter_params)
                                                                  .accessible_by(current_ability)

      render json: @task_attachments_signatures, each_serializer: TaskAttachmentSignatureSerializer::List, status: :ok
    end

    def create
      @task_attachment_signature = @task_attachment.task_attachment_signatures.new(user_id: params[:user_id])

      authorize! :create, @task_attachment_signature

      @task_attachment_signature.save!
      History.create!(history_params.merge(action: :created))

      render json: @task_attachment_signature, serializer: TaskAttachmentSignatureSerializer::Show, status: :created
    end

    def sign
      authorize! :update, @task_attachment_signature

      @task_attachment_signature.update!(signature: signature, signed_at: DateTime.now)
      @task_attachment_signature.run!

      render json: @task_attachment_signature, serializer: TaskAttachmentSignatureSerializer::Show, status: :ok
    end

    def refuse
      authorize! :update, @task_attachment_signature

      @task_attachment_signature.refuse!

      render json: @task_attachment_signature, serializer: TaskAttachmentSignatureSerializer::Show, status: :ok
    end

    def show
      @task_attachment_signature = @task_attachment.task_attachment_signatures.find(params[:id])

      authorize! :read, @task_attachment_signature

      render json: @task_attachment_signature, serializer: TaskAttachmentSignatureSerializer::Show, status: :ok
    end

    def destroy
      authorize! :destroy, @task_attachment_signature

      @task_attachment_signature.destroy!

      render json: @task_attachment_signature, serializer: TaskAttachmentSignatureSerializer::Show, status: :ok
    end

    private

    def filter_params
      params.permit(:user_id, :status, :task_id)
    end

    def history_params
      { trackable: @task_attachment_signature, user: current_user }
    end

    def set_task_attachment
      @task_attachment = Flow::TaskAttachment.find(params[:task_attachment_id])

      authorize! :read, @task_attachment
    end

    def set_task_attachment_signature
      @task_attachment_signature = @task_attachment.task_attachment_signatures.find(params[:task_attachment_signature_id] || params[:id])
    end

    def signature
      JsonWebToken.encode({ task_attachment_id: params[:task_attachment_id], user_id: current_user.id })
    end
  end
end
