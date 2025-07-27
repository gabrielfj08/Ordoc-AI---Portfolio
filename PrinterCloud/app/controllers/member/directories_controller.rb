module Member
  class DirectoriesController < BaseController
    before_action :set_directory, only: %i[show update destroy move]

    def index
      directories = Directory.not_trashed.kept
                             .filter_by(filter_params)
                             .search_by(params[:q])
                             .order_by(order_params)
                             .accessible_by(current_ability)
                             .paginate(page: params[:page])

      render json: directories, each_serializer: DirectorySerializer::List, status: :ok
    end

    def show
      authorize! :read, @directory

      render json: @directory, serializer: DirectorySerializer::Show, status: :ok
    end

    def create
      directory = Directory.new(create_params.merge(created_by: current_user))
      authorize! :create, directory
      directory.save!
      directory.publish_directory_created_event

      render json: directory, serializer: DirectorySerializer::Show, status: :created
    end

    def update
      authorize! :update, @directory
      @directory.update!(update_params.merge(updated_by: current_user))

      render json: @directory, serializer: DirectorySerializer::Show, status: :ok
    end

    def shared_directories
      render json: current_user.shared_directories.paginate(page: params[:page])
    end

    def destroy
      authorize! :update, @directory
      @directory.trash! current_user

      render json: @directory, serializer: DirectorySerializer::Show, status: :ok
    end

    def move
      authorize! :update, @directory
      path = PrinterCloud::Path.new(@directory, path_params)
      authorize! :read, path.destination
      directory = PrinterCloud::FileSystem.move(@directory, path: path)

      render json: directory, serializer: DirectorySerializer::Show, status: :ok
    end

    def count_by_organization
      organization = Organization.find(params[:organization_id])
      authorize! :read, organization
      count_directories = organization.departments.accessible_by(current_ability).flat_map do |dep|
        dep.directories.kept.accessible_by(current_ability)
      end.count

      render json: { data: count_directories }, status: :ok
    end

    def index_directories_paths
      directories = Directory.kept.filter_by_organization_id(params[:organization_id]).accessible_by(current_ability)

      directories = directories.remove_tree(Directory.find(params[:directory_id])) if params[:directory_id].present?

      render json: directories, each_serializer: DirectorySerializer::Path, status: :ok
    end

    private

    def parent_directory
      Directory.kept.find import_path_params[:directory_id] if import_path_params[:directory_id]
    end

    def department
      Department.find import_path_params[:department_id] if import_path_params[:department_id]
    end

    def set_directory
      @directory = Directory.kept.find(params[:id])
    end

    def create_params
      params.require(:directory).permit(:name, :description, :department_id, :parent_directory_id, files: [])
    end

    def update_params
      params.require(:directory).permit(:name, :description)
    end

    def path_params
      params.require(:to).permit(:directory_id, :department_id)
    end

    def filter_params
      params.permit(:department_id, :parent_directory_id, :name, :created_by_id, :updated_by_id, :organization_id,
                    created_at: %i[gte lte], updated_at: %i[gte lte])
    end

    def order_params
      params.permit(:order, :direction)
    end

    def import_path_params
      params.require(:directory).permit(:directory_id, :department_id)
    end

    def import_params
      params.require(:directory).permit(:key, :directory_id, :department_id, :ocr)
    end

    def current_ability
      @current_ability ||= DepartmentMemberAbility.new(current_user)
    end
  end
end
