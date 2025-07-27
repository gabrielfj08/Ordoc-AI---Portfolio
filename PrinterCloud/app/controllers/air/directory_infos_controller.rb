module Air
  class DirectoryInfosController < BaseController
    before_action :set_directory_info, only: [:show]
    before_action :set_directory, only: [:create, :show]
    load_ability :directory

    def create
      @directory_info = @directory.directory_infos.create!

      render json: @directory_info, serializer: DirectoryInfoSerializer::Show, status: :ok
    end

    def show
      render json: @directory_info, serializer: DirectoryInfoSerializer::Show, status: :ok
    end

    private

    def set_directory_info
      @directory_info = DirectoryInfo.find(params[:id])
    end

    def set_directory
      @directory = Directory.find(params[:directory_id])

      authorize! :read, @directory
    end
  end
end
