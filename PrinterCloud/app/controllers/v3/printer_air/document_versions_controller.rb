module V3
  module PrinterAir
    class DocumentVersionsController < BaseController
      before_action :set_document_version, only: %i[show destroy]

      def index
        document_versions = @organization.printer_air_documents
                                         .includes(:created_by)
                                         .kept
                                         .filter_by(filter_params)
                                         .order_by(order_params)
                                         .paginate(page: params[:page], per_page: params[:per_page])
                                         .accessible_by_user(current_user, :read)

        render json: document_versions, meta: { total: document_versions.count },
               each_serializer: ::V3::DocumentVersionSerializer::List, adapter: :json, status: :ok
      end

      def show
        render json: @document_version, serializer: ::V3::DocumentVersionSerializer::Show, status: :ok
      end

      def destroy
        authorize :delete, @document_version
        ::PrinterAirServices::DocumentVersionDestroyer.new(@document_version.id).call

        render json: @document_version, serializer: ::V3::DocumentVersionSerializer::Show, status: :ok
      end

      private

      def filter_params
        filter_params = params.permit

        if params[:path].present?
          filter_params.merge!(prn: "prn:printer_air:#{@organization.cnpj}:#{params[:path].delete_prefix('/')}")
        end

        filter_params
      end

      def set_document_version
        @document_version = @organization.printer_air_documents.find(params[:id])
        authorize :read, @document_version
      end

      def order_params
        params.permit(:order, :direction)
      end
    end
  end
end
