module Manager
  module RecycleBin
    class DirectoriesController < BaseController
      before_action :set_recycle_bin
      before_action :current_ability
      before_action :set_directory, only: %i[show destroy]
      before_action :set_trash_directory, only: %i[trash untrash]

      def index
        directories = @recycle_bin.directories
                                  .filter_by(filter_params)
                                  .search_by(params[:q])
                                  .order_by(order_params)
                                  .paginate(page: params[:page])

        render json: directories, status: :ok, each_serializer: DirectorySerializer::RecycleBin
      end

      def show
        authorize! :read, @directory
        render json: @directory, status: :ok, serializer: DirectorySerializer::RecycleBin
      end

      def untrash
        authorize! :update, @directory
        @directory.untrash! current_user
        render json: @directory, status: :ok, serializer: DirectorySerializer::RecycleBin
      end

      def destroy
        authorize! :destroy, @directory
        @directory.discard
        render json: @directory, status: :ok, serializer: DirectorySerializer::RecycleBin
      end

      private

      def filter_params
        params.permit(:department_id, :parent_directory_id, :name, :created_by_id, :updated_by_id, :organization_id,
                      created_at: %i[gte lte], updated_at: %i[gte lte])
      end

      def directories
        Directory.where(id: params[:directory_ids])
      end

      def order_params
        params.permit(:order, :direction)
      end

      def current_ability
        @current_ability ||= ::ManagerAbility.new(current_user)
      end

      def set_directory
        @directory = @recycle_bin.directories.find(params[:id] || params[:directory_id])
      end

      def set_trash_directory
        @directory = Directory.find(params[:id] || params[:directory_id])
      end

      def set_recycle_bin
        @recycle_bin = ::RecycleBin.find(params[:recycle_bin_id])
      end
    end
  end
end
