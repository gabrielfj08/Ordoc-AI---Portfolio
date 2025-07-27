module V3
  module PrinterFlow
    module External
      class ProcedureDocumentsController < BaseController
        before_action :set_procedure
        before_action :set_procedure_document, only: %i[destroy]
        load_ability :procedure_document

        def index
          procedure_documents = @procedure.procedure_documents
                                          .accessible_by(current_ability)
                                          .order_by(order_params)
                                          .filter_by(filter_params)
                                          .paginate(page: params[:page], per_page: params[:per_page])

          render json: procedure_documents, meta: { total: procedure_documents.total_entries },
                 each_serializer: V3::External::ProcedureDocumentSerializer::List, adapter: :json, status: :ok
        end

        def show
          procedure_document = @procedure.procedure_documents.find_by!(uuid: params[:uuid])
          authorize! :read, procedure_document

          render json: procedure_document, serializer: V3::External::ProcedureDocumentSerializer::Show,
                 status: :ok
        end

        def create
          procedure_document = @procedure.procedure_documents.new(create_params)
          authorize! :create, procedure_document
          procedure_document.save!

          render json: procedure_document, serializer: V3::External::ProcedureDocumentSerializer::Show, status: :created
        end

        def destroy
          authorize! :destroy, @procedure_document
          ActiveRecord::Base.transaction do
            new_payload = @procedure.payload
            new_payload.map do |payload|
              if payload['field_type'] == 'attachment'
                payload['value'] = payload['value'].select { |item| item != @procedure_document.uuid }
              end
            end
            @procedure.payload = new_payload
            @procedure.save!(validate: false)
            @procedure_document.destroy!
          end

          render json: @procedure_document, serializer: V3::External::ProcedureDocumentSerializer::Show,
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
          params.require(:procedure_document).permit(:s3_key, :name).merge(created_by_id: ENV['EXTERNAL_USER_ID'],
                                                                           source: :upload, key: params['procedure_document']['s3_key'])
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
end
