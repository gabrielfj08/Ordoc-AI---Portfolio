module Air
  class ShareableLinksController < BaseController
    before_action :set_document
    load_ability :document

    def create
      shareable_link = ShareableLink.create!(shareable_link_params)
      render json: shareable_link, serializer: ShareableLinkSerializer::Show, status: :ok
    end
  
    def show
      shareable_link = ShareableLink.find(params[:id])
      render json: shareable_link, serializer: ShareableLinkSerializer::Show, status: :ok
    end

    private

    def set_document
      @document = Document.find(shareable_link_params[:document_id])
      authorize! :update, @document
    end

    def shareable_link_params
      params.permit(:document_id, :expires_in)
    end
  end
end
