module V3
  module PrinterAir
    class RecentDocumentsController < BaseController
      def index
        @recent_documents = ::PrinterAir::RecentDocument.includes(:document)
                                                        .filter_by(filter_params)
                                                        .where(document_id: accessible_documents_ids)
                                                        .order_by(order_params)
                                                        .paginate(page: params[:page],
                                                                  per_page: params[:per_page])

        render json: @recent_documents, meta: { total: @recent_documents.count },
               each_serializer: ::V3::RecentDocumentSerializer::List, adapter: :json, status: :ok
      end

      private

      def documents_ids
        ::PrinterAir::RecentDocument.filter_by(filter_params).map(&:document).pluck(:id)
      end

      def accessible_documents_ids
        @organization.printer_air_documents.kept.current.accessible_by_user(current_user, :read)
                     .where(id: documents_ids).pluck(:id)
      end

      def filter_params
        filter_params = params.permit(:organization_id).merge!(user_id: current_user.id)

        if params[:path].present?
          filter_params.merge!(prn: "prn:printer_air:#{@organization.cnpj}:#{params[:path].delete_prefix('/')}/")
        end

        filter_params
      end

      def order_params
        params.permit(:order, :direction)
      end
    end
  end
end
