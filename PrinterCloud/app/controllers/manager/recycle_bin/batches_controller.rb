module Manager
  module RecycleBin
    class BatchesController < BaseController
      before_action :set_recycle_bin, :authorize_batch

      def destroy
        batch('destroy')
      end

      def untrash
        batch('untrash')
      end

      private

      def batch(action)
        ActiveRecord::Base.transaction do
          send("#{action}_objects", documents)
          send("#{action}_objects", directories)
        end

        render json: { documents: documents, directories: directories }, status: :ok
      end

      def destroy_objects(objects)
        objects.each do |object|
          authorize! :destroy, object
          object.discard
        end
      end

      def untrash_objects(objects)
        objects.each do |object|
          authorize! :update, object
          object.untrash! current_user
        end
      end

      def current_ability
        @current_ability ||= ManagerAbility.new(current_user)
      end

      def set_recycle_bin
        @recycle_bin = ::RecycleBin.find(params[:recycle_bin_id])
      end

      def documents
        Document.where(id: params[:document_ids])
      end

      def directories
        Directory.where(id: params[:directory_ids])
      end

      def authorize_batch
        raise CanCan::AccessDenied if documents.count != (params[:document_ids].count || 0)
        raise CanCan::AccessDenied if (@recycle_bin.documents & documents).count != documents.count
        raise CanCan::AccessDenied if directories.count != (params[:directory_ids].count || 0)
        raise CanCan::AccessDenied if (@recycle_bin.directories & directories).count != directories.count
      end
    end
  end
end
