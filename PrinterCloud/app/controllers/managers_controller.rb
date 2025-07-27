class ManagersController < BaseController
  def search
    managers = User.accessible_by(current_ability).organization_manager.paginate(page: params[:page])
    # authorize! :read, managers
    managers = managers.search_by(params[:q])
    render json: managers.paginate(page: params[:page]), each_serializer: UserSerializer::Base, status: :ok
  end
end
