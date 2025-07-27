module Flow
  class ProcedureAttachmentsController < BaseController
    before_action :set_procedure, only: [:create, :index, :sign, :destroy]
    before_action :set_procedure_attachment, only: [:show, :update, :destroy, :sign, :restore]
    load_ability :procedure_attachment, :procedure
  
    def index
      @procedure_attachments = @procedure.attachments.kept
                                                     .filter_by(filter_params)
                                                     .order_by(order_params)
                                                     .accessible_by(current_ability)
                                                     .paginate(page: params[:page])

      render json: @procedure_attachments, status: :ok, each_serializer: ProcedureAttachmentSerializer::Base
    end
  
    def show
      render json: @procedure_attachment, status: :ok, serializer: ProcedureAttachmentSerializer::Show
    end
  
    def create
      authorize! :update, @procedure
      @procedure_attachment = @procedure.attachments.new(create_procedure_attachment_params)
      authorize! :create, @procedure_attachment 

      ActiveRecord::Base.transaction do
        @procedure_attachment.save!
        @procedure_attachment.file.attach(file_params)
      end

      render json: @procedure_attachment, status: :created, serializer: ProcedureAttachmentSerializer::Show
    end
  
    def update
      authorize! :update, @procedure_attachment 
      @procedure_attachment.update!(update_procedure_attachment_params)

      render json: @procedure_attachment, status: :ok, serializer: ProcedureAttachmentSerializer::Show
    end
  
    def destroy
      authorize! :update, @procedure

      authorize! :destroy, @procedure_attachment 
      @procedure_attachment.discard

      render json: @procedure_attachment, status: :ok, serializer: ProcedureAttachmentSerializer::Show
    end

    def sign
      authorize! :read, @procedure

      @procedure_attachment.sign!(current_user)
    end

    def restore
      authorize! :update, @procedure_attachment 
      @procedure_attachment.undiscard

      render json: @procedure_attachment, status: :ok, serializer: ProcedureAttachmentSerializer::Show
    end

    private

    def set_procedure
      @procedure = Procedure.find(params[:procedure_id])
      authorize! :read, @procedure
    end

    def set_procedure_attachment
      @procedure_attachment = Flow::ProcedureAttachment.kept.find(params[:id])
      authorize! :read, @procedure_attachment
    end

    def filter_params
      params.permit(:procedure_id)
    end

    def order_params
      params.permit(:order, :direction)
    end

    def order_params
      params.permit(:order, :direction)
    end
    
    def file_params
      params.require(:procedure_attachment).require(:file)
    end
  
    def create_procedure_attachment_params
      params.require(:procedure_attachment)
            .permit
            .merge({ name: file_params.original_filename })
    end

    def update_procedure_attachment_params
      params.require(:procedure_attachment).permit(:name)
    end
  end
end
