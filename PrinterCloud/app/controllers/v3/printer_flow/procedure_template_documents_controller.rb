module V3
  module PrinterFlow
    class ProcedureTemplateDocumentsController < BaseController
      before_action :set_procedure_template
      before_action :set_procedure_template_document, only: %i[show destroy]

      def index
        procedure_template_documents = @procedure_template.procedure_template_documents
                                                          .filter_by(filter_params)
                                                          .search_by(params[:q])
                                                          .order_by(order_params)
                                                          .paginate(page: params[:page], per_page: params[:per_page])

        render json: procedure_template_documents, meta: { total: procedure_template_documents.count },
               each_serializer: V3::ProcedureTemplateDocumentSerializer::List, adapter: :json, status: :ok
      end

      def show
        render json: @procedure_template_document, serializer: V3::ProcedureTemplateDocumentSerializer::Show,
               status: :ok
      end

      def create
        authorize :update, @procedure_template
        procedure_template_document = @procedure_template.procedure_template_documents.create!(create_params)

        render json: procedure_template_document, serializer: V3::ProcedureTemplateDocumentSerializer::Show,
               status: :created
      end

      def destroy
        authorize :update, @procedure_template
        @procedure_template_document.destroy!

        render json: @procedure_template_document, serializer: V3::ProcedureTemplateDocumentSerializer::Show,
               status: :ok
      end

      private

      def set_procedure_template
        @procedure_template = @organization.procedure_templates.find(params[:procedure_template_id])
      end

      def set_procedure_template_document
        @procedure_template_document = @procedure_template.procedure_template_documents.find(params[:id])
      end

      def create_params
        params.require(:procedure_template_document).permit(:name, :s3_key).merge(created_by_id: current_user.id)
      end

      def order_params
        params.permit(:order, :direction)
      end

      def filter_params
        params.permit(status: [])
      end
    end
  end
end
