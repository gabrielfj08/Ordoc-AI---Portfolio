module Manager
  module RecycleBin
    class DocumentsController < BaseController
      before_action :set_recycle_bin
      before_action :current_ability
      before_action :set_document, only: %i[show destroy]
      before_action :set_trash_document, only: %i[trash untrash]

      def index
        documents = @recycle_bin.documents
                                .filter_by(filter_params)
                                .search_by(params[:q])
                                .order_by(order_params)
                                .paginate(page: params[:page])

        render json: documents, status: :ok, each_serializer: DocumentSerializer::RecycleBin
      end

      def show
        authorize! :read, @document
        render json: @document, status: :ok, serializer: DocumentSerializer::RecycleBin
      end

      def untrash
        authorize! :update, @document
        @document.untrash! current_user
        render json: @document, status: :ok, serializer: DocumentSerializer::RecycleBin
      end

      def destroy
        authorize! :destroy, @document
        @document.discard
        @document.update!(deleted_by_id: current_user.id)

        render json: @document, status: :ok, serializer: DocumentSerializer::RecycleBin
      end

      private

      def filter_params
        params.permit(:department_id, :recycle_bin_id, :parent_document_id, :name, :created_by_id, :updated_by_id,
                      :organization_id, created_at: %i[gte lte], updated_at: %i[gte lte])
      end

      def documents
        Document.where(id: params[:document_ids])
      end

      def order_params
        params.permit(:order, :direction)
      end

      def current_ability
        @current_ability ||= ::ManagerAbility.new(current_user)
      end

      def set_document
        @document = @recycle_bin.documents.find(params[:id] || params[:document_id])
      end

      def set_trash_document
        @document = Document.find(params[:id] || params[:document_id])
      end

      def set_recycle_bin
        @recycle_bin = ::RecycleBin.find(params[:recycle_bin_id])
      end
    end
  end
end
