class AdminsController < BaseController
  def search
    authorize! :read, User
    admins = User.accessible_by(current_ability).admin.paginate(page: params[:page])
    admins = admins.search_by(params[:q])
    render json: admins.paginate(page: params[:page]), each_serializer: UserSerializer::Base, status: :ok
  end
end
