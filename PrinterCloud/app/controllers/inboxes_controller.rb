class InboxesController < BaseController
  before_action :set_document, only: [:destroy, :show_document]

  def index
    documents = current_user.inbox.documents.kept.order_by(order_params)

    render json: documents.paginate(page: params[:page]), each_serializer: DocumentSerializer::Optical::Base, status: :ok
  end

  def show_document
    if current_user.inbox.documents.kept.include? @document
      render json: @document, serializer: DocumentSerializer::Optical::Show, status: :ok
    else
      render json: {}, status: :unauthorized
    end
  end

  def count_documents
    render json: { data: current_user.inbox.documents.kept.count }, status: :ok
  end
  

  def show_recycle_bin
    render json: current_user.inbox.documents.discarded.order_by(order_params).paginate(page: params[:page]), each_serializer: DocumentSerializer::Optical::Base, status: :ok
  end

  def destroy
    authorize! :destroy, @document
    if current_user.inbox.documents.include? @document
      @document.discard
      render json: @document, serializer: DocumentSerializer::Optical::Base, status: :ok
    else
      render json: {}, status: :unauthorized
    end
  end

  private

  def set_document
    @document = Document.find(params[:id])
    authorize! :read, @document
  end

  def order_params
    params.permit(:order, :direction)
  end
end
