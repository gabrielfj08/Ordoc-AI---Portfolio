module V3
  module PrinterFlow
    class SignaturesController < BaseController
      before_action :set_signature, only: %i[show sign refuse destroy]
      load_ability :signature
      attr_accessor :signature, :procedure, :qr_code, :protocol_token

      def index
        signatures = ::PrinterSign::Signature.includes(:signable)
                                             .includes(:procedure)
                                             .includes(:requester)
                                             .includes(:created_by)
                                             .accessible_by(current_ability)
                                             .filter_by(filter_params)
                                             .order_by(order_params)
                                             .paginate(page: params[:page], per_page: params[:per_page])

        render json: signatures, meta: { total: signatures.total_entries },
               each_serializer: ::V3::SignatureSerializer::List, include: '**', adapter: :json, status: :ok
      end

      def show
        authorize! :read, @signature
        render json: @signature, serializer: ::V3::SignatureSerializer::Show, status: :ok
      end

      def create
        signature = ::PrinterSign::Signature.new(procedure_id: procedure.id)
        authorize! :create, signature

        batch_operation = ::PrinterFlowServices::BatchOperationCreator.new(action: 'request_signature',
                                                                           record_type: 'PrinterSign::Signature',
                                                                           payload: { "procedure_document_ids": params[:procedure_document_ids],
                                                                                      "task_document_ids": params[:task_document_ids] },
                                                                           created_by: current_user,
                                                                           ids: params[:requester_ids]).call

        render json: batch_operation, serializer: ::V3::BatchOperationSerializer::Show, status: :ok
      end

      def sign
        authorize! :update, @signature
        @signature.run!

        render json: @signature, serializer: ::V3::SignatureSerializer::Show, status: :ok
      end

      def refuse
        authorize! :update, @signature

        signature = ::PrinterFlowServices::SignatureRefuser.new({ signature: @signature,
                                                                  created_by_id: current_user.internal_requester.id,
                                                                  note: params[:note],
                                                                  action: params[:action] }).call

        render json: signature, serializer: ::V3::SignatureSerializer::Show, status: :ok
      end

      def destroy
        authorize! :destroy, @signature
        @signature.destroy!

        render json: @signature, serializer: ::V3::SignatureSerializer::Show, status: :ok
      end

      def count_by_status
        signatures_count = PrinterSign::Signature.count_by_status(current_user)

        render json: signatures_count, status: :ok
      end

      private

      def procedure
        document = ::PrinterFlow::ProcedureDocument.find_by(id: params[:procedure_document_ids].first)
        document = ::PrinterFlow::TaskDocument.find_by(id: params[:task_document_ids].first) if document.blank?

        raise Error::PrinterFlow::CanNotCreateSignatureForNilDocument if document.nil?

        if document.procedure.status != 'running' && document.procedure.status != 'started'
          raise Error::PrinterFlow::ProcedureIsNotStarted
        end

        document.procedure
      end

      def set_signature
        @signature = ::PrinterSign::Signature.find(params[:id] || params[:signature_id])
      end

      def filter_params
        Signable.map_params(params.permit(:user_id, :requester_id, :signable_type, :signable_id,
                                          :created_by_id, :procedure_id, status: []))
      end

      def order_params
        params.permit(:order, :direction)
      end
    end
  end
end
