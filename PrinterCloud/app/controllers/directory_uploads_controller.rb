class DirectoryUploadsController < BaseController
  before_action :set_directory_upload, only: :show
  before_action :validate_and_authorize_path, only: :create

  def create
    directory_upload = DirectoryUpload.create!(create_params)
    directory_upload_workflow = DirectoryUploadWorker.perform_async(directory_upload.id, create_params.to_h.merge(created_by_id: current_user.id))
    render json: directory_upload, status: :created
  end

  def show
    render json: @directory_upload, status: :ok
  end

  private

  def set_directory_upload
    @directory_upload = DirectoryUpload.find(params[:id])
    authorize! :read, @directory_upload.root
  end

  def create_params
    params.require(:directory_upload).permit(:ocr, :s3_object_key, :department_id, :directory_id, :location, :description, documents:[:s3_key, :name])
  end

  def path_params
    params.require(:directory_upload).permit(:department_id, :directory_id)
  end

  def validate_and_authorize_path
    path = PrinterCloud::Path.new(Directory.new, path_params)
    PrinterCloud::Validators::Path.new(path).validate!
    authorize! :read, path.destination
  end
end
