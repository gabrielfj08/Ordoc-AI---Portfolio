module Flow
  class ProcedureAttachmentSignaturesController < BaseController
    before_action :set_procedure_attachment, only: [:index, :show, :create]
    load_ability :procedure_attachment, :procedure_attachment_signature

    attr_accessor :signature, :procedure

    def index
      @procedure_attachment_signatures = @procedure_attachment.procedure_attachment_signatures.includes(:user).accessible_by(current_ability)

      render json: @procedure_attachment_signatures, each_serializer: ProcedureAttachmentSignatureSerializer::List, status: :ok
    end

    def create
      @procedure_attachment_signature = @procedure_attachment.procedure_attachment_signatures.new(create_params)

      authorize! :create, @procedure_attachment_signature

      @procedure_attachment_signature.save!

      render json: @procedure_attachment_signature, serializer: ProcedureAttachmentSignatureSerializer::Show, status: :created
    end

    def show
      @procedure_attachment_signature = @procedure_attachment.procedure_attachment_signatures.find(params[:id])

      authorize! :read, @procedure_attachment_signature

      render json: @procedure_attachment_signature, serializer: ProcedureAttachmentSignatureSerializer::Show, status: :ok
    end

    private

    def set_procedure_attachment
      @procedure_attachment = Flow::ProcedureAttachment.find(params[:procedure_attachment_id])

      authorize! :read, @procedure_attachment
    end

    def create_params
      { user: current_user, signature: signature }
    end

    def signature
      JsonWebToken.encode({ procedure_attachment_id: params[:procedure_attachment_id], user_id: current_user.id })
    end
  end
end
