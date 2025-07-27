module V3
  module PrinterFlow
    module External
      class ProcedureTemplateDocumentsController < BaseController
        before_action :set_procedure_template
        before_action :set_procedure_template_document, only: %i[show]
        load_ability :procedure_template_document

        def index
          procedure_template_documents = @procedure_template.procedure_template_documents
                                                            .accessible_by(current_ability)
                                                            .search_by(params[:q])
                                                            .order_by(order_params)
                                                            .paginate(page: params[:page], per_page: params[:per_page])

          render json: procedure_template_documents, meta: { total: procedure_template_documents.total_entries },
                 each_serializer: V3::External::ProcedureTemplateDocumentSerializer::List, adapter: :json, status: :ok
        end

        def show
          authorize! :read, @procedure_template_document

          render json: @procedure_template_document, serializer: V3::External::ProcedureTemplateDocumentSerializer::Show,
                 status: :ok
        end

        private

        def set_procedure_template
          @procedure_template = @organization.procedure_templates.find(params[:procedure_template_id])
        end

        def set_procedure_template_document
          @procedure_template_document = @procedure_template.procedure_template_documents.find(params[:id])
        end

        def order_params
          params.permit(:order, :direction)
        end
      end
    end
  end
end
