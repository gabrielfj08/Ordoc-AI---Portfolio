class ShareableLinksController < ApplicationController
  def show
    @shareable_link = ::PrinterAir::ShareableLink.not_expired.find_by!(uuid: params[:uuid])

    render json: @shareable_link, serializer: ::V3::ShareableLinkSerializer::Show, status: :ok
  end
end
