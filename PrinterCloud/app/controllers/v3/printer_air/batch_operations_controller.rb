module V3
  module PrinterAir
    class BatchOperationsController < BaseController
      before_action :set_document, only: %i[show]

      def show
        raise ::Error::PrinterAir::UnauthorizedError if current_user != @batch_operation.created_by

        render json: @batch_operation, serializer: ::V3::BatchOperationSerializer::Show, status: :ok
      end

      private

      def set_document
        @batch_operation = ::PrinterAir::BatchOperation.find(params[:id])
      end
    end
  end
end
