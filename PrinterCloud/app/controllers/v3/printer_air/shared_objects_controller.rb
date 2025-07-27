module V3
  module PrinterAir
    class SharedObjectsController < BaseController
      before_action :set_object, only: %i[index]

      def index
        authorize :read, @object
        shared_objects = @object.shared_objects
                                .includes(:user)
                                .paginate(page: params[:page],
                                          per_page: params[:per_page])

        render json: shared_objects, meta: { total: shared_objects.count },
               each_serializer: ::V3::SharedObjectsSerializer::List, adapter: :json, status: :ok
      end

      def destroy
        @shared_object = ::PrinterAir::SharedObject.find(params[:id])
        authorize :share, @shared_object.object_prn

        DestroyerWorker.perform_async(@shared_object.id, @shared_object.class)

        render json: @shared_object, serializer: ::V3::SharedObjectsSerializer::List, status: :ok
      end

      private

      def set_object
        @object = if params[:document_id].present?
                    @organization.printer_air_documents.kept.find(params[:document_id])
                  else
                    @organization.printer_air_directories.kept.find(params[:directory_id])
                  end
      end
    end
  end
end
