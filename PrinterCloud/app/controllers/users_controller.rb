class UsersController < BaseController
  before_action :set_user, only: %i[show update destroy add_avatar]

  def index
    users = User.accessible_by(current_ability).paginate(page: params[:page])
    filter_params.each do |key, value|
      users = users.public_send("filter_by_#{key}", value) if value.present?
    end
    users = users.filter_by_role(role_params[:type]) if role_params[:type].present?
    render json: users.paginate(page: params[:page]), each_serializer: UserSerializer::List, status: :ok
  end

  def show
    authorize! :read, @user
    render json: @user, serializer: UserSerializer::Base, status: :ok
  end

  def update
    authorize! :update, @user
    @user.update!(user_params)
    render json: @user, serializer: UserSerializer::Base, status: :ok
  end

  def destroy
    authorize! :destroy, @user
    @user.discard
    render json: @user, serializer: UserSerializer::Base, status: :ok
  end

  def really_destroy
    @user = User.discarded.find(params[:user_id])
    authorize! :destroy, @user
    nullify_user_document_versions
    @user.destroy
    render json: @user, serializer: UserSerializer::Base, status: :ok
  end

  def restore
    @user = User.discarded.find(params[:user_id])
    authorize! :update, @user
    @user.undiscard
    render json: @user, serializer: UserSerializer::Base, status: :ok
  end

  def search
    authorize! :read, User
    users = User.accessible_by(current_ability).paginate(page: params[:page])
    users = users.search_by(params[:q])
    render json: users.paginate(page: params[:page]), each_serializer: UserSerializer::List, status: :ok
  end
  
  # TODO: DEPRECATED
  def latest_documents_accessed
    render json: current_user.recent_documents.kept.filter_by_organization_id(params[:organization_id]).order(updated_at: :asc).reverse.paginate(page: params[:page]), 
      each_serializer: RecentDocumentSerializer, status: :ok
  end

  def add_avatar
    authorize! :update, @user
    @user.avatar.attach(params[:avatar])

    render json: @user, serializer: UserSerializer::Base, status: :ok
  end

  private

  def set_user
    @user = User.find(params[:id] || params[:user_id])
  end

  def user_params
    params.require(:user).permit(:email, :name, :phone, :password, :password_confirmation, :cpf, :date_of_birth)
  end

  def filter_params
    params.permit(:email, :name, :department_id, :organization_id, :user_group_id)
  end

  def role_params
    Roles.map_params(params.permit(role: :type).fetch(:role, {}))
  end

  def nullify_user_document_versions
    Document.unscoped.where(created_by_id: @user.id).update_all(created_by_id: nil)
    Document.unscoped.where(updated_by_id: @user.id).update_all(updated_by_id: nil)
  end

  def current_ability
    @current_ability ||= UserAbility.new(current_user)
  end
end
