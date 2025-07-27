module Air
  class DestroyShareableLinksController < BaseController
    before_action :set_document
    load_ability :document

    def create
      destroy_shareable_link = DestroyShareableLink.create!(destroy_shareable_link_params)
      render json: destroy_shareable_link, status: :ok
    end

    def show
      destroy_shareable_link = DestroyShareableLink.find(params[:id])
      render json: destroy_shareable_link, status: :ok
    end

    private

    def set_document
      @document = Document.find(destroy_shareable_link_params[:document_id])
      authorize! :update, @document
    end

    def destroy_shareable_link_params
      params.permit(:document_id)
    end
  end
end
