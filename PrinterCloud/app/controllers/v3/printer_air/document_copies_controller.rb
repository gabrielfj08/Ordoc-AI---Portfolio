module V3
  module PrinterAir
    class DocumentCopiesController < BaseController
      before_action :set_document, only: %i[create show]
      before_action :set_document_copy, only: %i[show]

      def show
        authorize :create, @document

        render json: @document_copy, serializer: ::V3::DocumentCopySerializer::Show, status: :ok
      end

      def create
        authorize :create, @document
        document_copy = @document.document_copies.create!(created_by_id: current_user.id)

        render json: document_copy, serializer: ::V3::DocumentCopySerializer::Show, status: :ok
      end

      private

      def set_document_copy
        @document_copy = @document.document_copies.find(params[:id])
      end

      def set_document
        @document = @organization.printer_air_documents.kept.current.find(params[:document_id])
      end
    end
  end
end
