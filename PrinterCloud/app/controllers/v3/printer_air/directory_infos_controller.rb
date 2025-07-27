module V3
  module PrinterAir
    class DirectoryInfosController < BaseController
      before_action :set_directory, only: %i[create show]
      before_action :set_directory_info, only: %i[show]

      def create
        authorize :read, @directory

        @directory_info = @directory.directory_infos.create!(created_by_id: current_user.id)

        render json: @directory_info, serializer: DirectoryInfoSerializer::Show, status: :ok
      end

      def show
        authorize :read, @directory

        render json: @directory_info, serializer: DirectoryInfoSerializer::Show, status: :ok
      end

      private

      def set_directory_info
        @directory_info = @directory.directory_infos.find(params[:id])
      end

      def set_directory
        @directory = ::PrinterAir::Directory.kept.find(params[:directory_id])
      end
    end
  end
end
