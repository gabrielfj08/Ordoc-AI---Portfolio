module V3
  module PrinterAir
    class DirectoriesController < BaseController
      before_action :set_directory, only: %i[show update]

      def index
        directories = @organization.printer_air_directories
                                   .includes(:updated_by)
                                   .includes(:parent_directory)
                                   .kept
                                   .filter_by(filter_params)
                                   .order_by(order_params)
                                   .paginate(page: params[:page], per_page: params[:per_page])
                                   .accessible_by_user(current_user)

        render json: directories, meta: { total: directories.total_entries },
               each_serializer: ::V3::DirectorySerializer::List, adapter: :json, status: :ok
      end

      def show
        authorize :read, @directory
        render json: @directory, serializer: ::V3::DirectorySerializer::Show, status: :ok
      end

      def create
        directory = PrinterAirServices::DirectoryCreator.new(create_params: create_params).call
        authorize :create, directory
        directory.save!

        render json: directory, serializer: ::V3::DirectorySerializer::Show, status: :ok
      end

      def update
        authorize :update, @directory

        @directory.update!(update_params.merge(updated_by: current_user))

        render json: @directory, serializer: ::V3::DirectorySerializer::Show, status: :ok
      end

      def move
        verify_if_directory_is_shared
        authorize_batch :delete, directories, UnauthorizedMessages.delete
        authorize_create_on_destination_directory

        batch_operation = ::PrinterAirServices::BatchOperationCreator.new(action: params[:batch_action],
                                                                          record_type: 'PrinterAir::Directory',
                                                                          payload: params[:payload],
                                                                          created_by: current_user,
                                                                          ids: params[:ids]).call

        render json: batch_operation, serializer: ::V3::BatchOperationSerializer::Show, status: :ok
      end

      def share
        authorize_batch :share, directories, UnauthorizedMessages.share

        shared_object = ::PrinterAirServices::BatchOperationCreator.new(action: 'share',
                                                                        record_type: 'PrinterAir::Directory',
                                                                        payload: params[:payload],
                                                                        created_by: current_user,
                                                                        ids: params[:ids]).call

        render json: shared_object, serializer: ::V3::BatchOperationSerializer::Show, status: :ok
      end

      def trash
        verify_if_directory_is_shared
        authorize_batch :delete, directories, UnauthorizedMessages.delete

        batch_operation = ::PrinterAirServices::BatchOperationCreator.new(action: 'trash',
                                                                          created_by: current_user,
                                                                          record_type: 'PrinterAir::Directory',
                                                                          ids: params[:ids]).call

        render json: batch_operation, serializer: ::V3::BatchOperationSerializer::Show, status: :ok
      end

      def restore
        authorize_batch :restore, directories, UnauthorizedMessages.restore

        batch_operation = ::PrinterAirServices::BatchOperationCreator.new(action: 'restore_and_keep',
                                                                          created_by: current_user,
                                                                          record_type: 'PrinterAir::Directory',
                                                                          ids: params[:ids]).call

        render json: batch_operation, serializer: ::V3::BatchOperationSerializer::Show, status: :ok
      end

      private

      def directories
        @organization.printer_air_directories.kept.where(id: params[:ids])
      end

      def authorize_create_on_destination_directory
        directories.find_each do |directory|
          directory_prn = "#{@organization.printer_air_directories.kept.find_by(id: params['payload']['directory_id']).prn}#{directory.name}/"
          authorize :create, directory_prn
        end
      end

      def verify_if_directory_is_shared
        directories.each do |directory|
          next unless directory.shared?

          raise Error::CustomError.new(:unauthorized, 401,
                                       I18n.t('printer_air.errors.messages.unshare_object',
                                              attribute: directory.name))
        end
      end

      def filter_params
        filter_params = params.permit(:directory_id)

        if params[:path].present?
          filter_params.merge!(prn: "prn:printer_air:#{@organization.cnpj}:#{params[:path].delete_prefix('/')}/")
        end

        filter_params
      end

      def order_params
        params.permit(:order, :direction)
      end

      def update_params
        params.require(:directory).permit(:description)
      end

      def create_params
        params.require(:directory).permit(:name, :description,
                                          :parent_directory_id).merge!(organization_id: params[:organization_id],
                                                                       created_by: current_user, updated_by: current_user)
      end

      def set_directory
        @directory = @organization.printer_air_directories.kept.find(params[:id])
      end
    end
  end
end
