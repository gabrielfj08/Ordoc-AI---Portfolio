module Air
  class DirectoriesController < BaseController
    before_action :set_directory, only: [:show, :update, :destroy]
    load_ability :directory

    #TODO: MIGRATE ALL DIRECTORIES ROUTES
    def shared_directories
      @directories = Directory.not_trashed.kept
                              .filter_by_shared_directories(current_user)
                              .order_by(order_params)
                              .accessible_by(current_ability)
                              .paginate(page: params[:page])
      render json: @directories, each_serializer: DirectorySerializer::Shared, current_user: current_user, status: :ok
    end

    def show_shared_directory
      @directory = Directory.not_trashed.kept.filter_by_shared_directories(current_user).find(params[:id])
      authorize! :read, @directory

      render json: @directory, serializer: DirectorySerializer::Shared, current_user: current_user, status: :ok
    end

    def show
      authorize! :read, @directory

      render json: @directory, serializer: DirectorySerializer::Show, status: :ok
    end

    def update
      authorize! :update, @directory
      @directory.update!(update_params.merge(updated_by: current_user))

      render json: @directory, serializer: DirectorySerializer::Show, status: :ok
    end

    def destroy
      authorize! :update, @directory
      @directory.trash! current_user

      render json: @directory, serializer: DirectorySerializer::Show, status: :ok
    end

    def create_in_printer_driver
      @directory = Directory.find(params[:directory_id])
      authorize! :read, @directory

      key = "#{ENV['RAILS_ENV']}/#{@directory.department.organization_id}#{@directory.path}/"
      s3_client.put_object(bucket: 'printer-driver', key: key)

      render json: { message: "#{key} successfully created in printer-driver bucket"  }
    end

    private

    def order_params
      params.permit(:order, :direction)
    end

    def s3_client
      Aws::S3::Client.new(credentials: PrinterCloud::Aws.credentials)
    end

    def set_directory
      @directory = Directory.find(params[:id])

      authorize! :read, @directory
    end

    def update_params
      params.require(:directory).permit(:name, :description)
    end
  end
end
