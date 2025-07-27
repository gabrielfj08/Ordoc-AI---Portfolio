module Manager
  class DirectoriesController < ManagersController
    before_action :set_organization

    def index
      directories = Directory.not_trashed.kept
                             .filter_by(filter_params)
                             .order_by(order_params)
                             .accessible_by(current_ability)
                             .paginate(page: params[:page])

      render json: directories, each_serializer: DirectorySerializer::List, status: :ok
    end

    def index_directories_paths
      directories = Directory.kept.filter_by_organization_id(params[:organization_id]).accessible_by(current_ability)

      render json: directories, each_serializer: DirectorySerializer::Path, status: :ok
    end

    def count_by_organization
      organization = Organization.kept.find(params[:organization_id])
      authorize! :read, organization
      count_directories = organization.directories.kept.count

      render json: {data: count_directories}, status: :ok
    end

    private

    def current_ability
      @current_ability ||= ManagerAbility.new(current_user)
    end

    def filter_params
      params.permit(:department_id, :parent_directory_id, :name, :created_by_id, :updated_by_id)
    end

    def order_params
      params.permit(:order, :direction)
    end

    def set_organization
      organization = Organization.find(params[:organization_id])
      authorize! :read, organization
    end
  end
end
