module V3
  module PrinterAir
    class ShareableLinksController < BaseController
      before_action :set_document, only: %i[index create destroy]
      before_action :set_shareable_link, only: %i[destroy]

      def index
        shareable_links = @document.shareable_links
                                   .includes(:created_by)
                                   .not_expired
                                   .paginate(page: params[:page],
                                             per_page: params[:per_page])

        render json: shareable_links, meta: { total: shareable_links.count },
               each_serializer: ::V3::ShareableLinkSerializer::List, adapter: :json, status: :ok
      end

      def create
        shareable_link = @document.shareable_links.create!(create_params)

        render json: shareable_link, serializer: ::V3::ShareableLinkSerializer::Base, status: :ok
      end

      def destroy
        authorize :update, @document
        @shareable_link.destroy!

        render json: @shareable_link, serializer: ::V3::ShareableLinkSerializer::Base, status: :ok
      end

      private

      def create_params
        params.require(:shareable_link).permit(:expires_in).merge!(created_by_id: current_user.id)
      end

      def set_document
        @document = @organization.printer_air_documents.kept.current.find(params[:document_id])

        authorize :read, @document
      end

      def set_shareable_link
        @shareable_link = @document.shareable_links.find(params[:id])
      end
    end
  end
end
