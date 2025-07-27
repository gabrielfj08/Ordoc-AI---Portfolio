module V3
  module PrinterAir
    class SharedDocumentsController < BaseController
      def index
        shared_objects = @organization.shared_objects
                                      .includes(:created_by)
                                      .includes(:document)
                                      .filter_by(filter_params)
                                      .paginate(page: params[:page],
                                                per_page: params[:per_page])

        render json: shared_objects, each_serializer: V3::SharedDocumentsSerializer::List,
               meta: { total: shared_objects.count }, adapter: :json, status: :ok
      end

      private

      def filter_params
        params.permit(:parent_shared_id, :root).merge(user_id: current_user, record_type: 'PrinterAir::Document')
      end
    end
  end
end
