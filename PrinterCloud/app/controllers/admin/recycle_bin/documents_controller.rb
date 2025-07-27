module Admin
  module RecycleBin
    class DocumentsController < BaseController
      before_action :set_recycle_bin
      before_action :set_document, only: [:restore]

      def restore
        authorize! :update, @document
        @document.undiscard
        render json: @document, status: :ok, serializer: DocumentSerializer::RecycleBin
      end

      def restore_batch
        ActiveRecord::Base.transaction do 
          documents.each do |document|
            authorize! :update, document
            document.undiscard
          end
        end
        render json: documents.reload, status: :ok, each_serializer: DocumentSerializer::RecycleBin
      end

      private

      def documents
        Document.where(id: params[:document_ids])
      end
      
      def current_ability
        @current_ability ||= ::AdminAbility.new(current_user)
      end

      def set_document
        @document = @recycle_bin.documents.find(params[:id] || params[:document_id])
      end

      def set_recycle_bin
        @recycle_bin = ::RecycleBin.find(params[:recycle_bin_id])
      end
    end
  end
end
