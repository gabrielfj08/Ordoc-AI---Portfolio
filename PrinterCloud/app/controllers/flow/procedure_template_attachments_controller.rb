module Flow
  class ProcedureTemplateAttachmentsController < BaseController
    before_action :set_procedure_template
    before_action :set_procedure_template_attachment, only: [:show, :update, :destroy, :restore]
    load_ability :procedure_template_attachment, :procedure_template

    def index
      @procedure_template_attachments = @procedure_template.attachments.filter_by(filter_params)
                                                                       .order_by(order_params)
                                                                       .accessible_by(current_ability)
                                                                       .paginate(page: params[:page])

      render json: @procedure_template_attachments, status: :ok, each_serializer: ProcedureTemplateAttachmentSerializer::List
    end

    def show
      render json: @procedure_template_attachment, status: :ok, serializer: ProcedureTemplateAttachmentSerializer::Show
    end

    def create
      @procedure_template_attachment = @procedure_template.attachments.new(create_procedure_template_attachment_params)
      authorize! :create, @procedure_template_attachment

      ActiveRecord::Base.transaction do
        @procedure_template_attachment.save!
        @procedure_template_attachment.file.attach(file_params)
      end

      render json: @procedure_template_attachment, status: :created, serializer: ProcedureTemplateAttachmentSerializer::Show
    end

    def destroy
      authorize! :destroy, @procedure_template_attachment
      @procedure_template_attachment.destroy!

      render json: @procedure_template_attachment, status: :ok, serializer: ProcedureTemplateAttachmentSerializer::Show
    end

    private

    def create_procedure_template_attachment_params
      params.require(:procedure_template_attachment)
            .permit
            .merge({ name: file_params.original_filename })
    end

    def file_params
      params.require(:procedure_template_attachment).require(:file)
    end

    def filter_params
      params.permit(:procedure_template_id)
    end

    def order_params
      params.permit(:order, :direction)
    end

    def set_procedure_template
      @procedure_template = Flow::ProcedureTemplate.kept.find(params[:procedure_template_id])
      authorize! :read, @procedure_template
    end

    def set_procedure_template_attachment
      @procedure_template_attachment = Flow::ProcedureTemplateAttachment.find(params[:id])
      authorize! :read, @procedure_template_attachment
    end
  end
end
