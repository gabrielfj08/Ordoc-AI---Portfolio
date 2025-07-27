module V4
  module PrinterFlow
    class ProcedureDocumentsController < BaseController
      before_action :set_procedure
      before_action :set_procedure_document, only: %i[destroy]
      load_ability :procedure_document, :procedure

      def index
        authorize! :read, @procedure
        procedure_documents = @procedure.procedure_documents
                                        .order_by(order_params)
                                        .filter_by(filter_params)
                                        .paginate(page: params[:page], per_page: params[:per_page])

        render json: procedure_documents, meta: { total: procedure_documents.count },
               each_serializer: V4::ProcedureDocumentSerializer::List, adapter: :json, status: :ok
      end

      def show
        authorize! :read, @procedure
        procedure_document = @procedure.procedure_documents.find_by!(uuid: params[:uuid])

        render json: procedure_document, serializer: V4::ProcedureDocumentSerializer::Show,
               status: :ok
      end

      def create
        procedure_document = @procedure.procedure_documents.new(create_params)
        authorize! :create, procedure_document
        procedure_document.save!

        render json: procedure_document, serializer: V4::ProcedureDocumentSerializer::Show, status: :created
      end

      def destroy
        authorize! :destroy, @procedure_document

        procedure_document = ::PrinterFlowServices::ProcedureDocumentDestroyer.new(@procedure_document.id).call

        render json: procedure_document, serializer: V4::ProcedureDocumentSerializer::Show,
               status: :ok
      end

      private

      def set_procedure
        @procedure = @organization.printer_flow_procedures.find(params[:procedure_id])
      end

      def set_procedure_document
        @procedure_document = @procedure.procedure_documents.find(params[:id])
      end

      def create_params
        params.require(:procedure_document).permit(:key, :name, :source).merge(created_by_id: current_user.id,
                                                                               s3_key: params['procedure_document']['key'])
      end

      def order_params
        params.permit(:order, :direction)
      end

      def filter_params
        params.permit(status: [], source: [])
      end
    end
  end
end
