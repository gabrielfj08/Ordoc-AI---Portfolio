class RolesController < BaseController
  def index
    roles = Role.accessible_by(current_ability)
    filter_params.each do |key, value|
      roles = roles.public_send("filter_by_#{key}", value) if value.present?
    end
    render json: roles.paginate(page: params[:page]), each_serializer: RoleSerializer, status: :ok
  end

  def create
    authorize! :create, Role
    role = Role.create!(role_params)
    render json: role, serializer: RoleSerializer, status: :created
  end

  def destroy
    role = Role.find(params[:id])
    authorize! :destroy, role
    role.destroy
    render json: role, serializer: RoleSerializer, status: :ok
  end

  def destroy_many
    roles = Role.where(destroy_many_params)
    roles.each{|role| authorize! :destroy, role}
    destroyed_roles = roles.destroy_all
    
    render json: destroyed_roles.paginate(page: params[:page]), status: :ok
  end

  private

  def destroy_many_params
    Roles.map_params(params.permit(:user_id, :type))
  end

  def filter_params
    Roles.map_params(params.permit(:type, :user_id, :organization_id))
  end

  def role_params
    Roles.map_params(params.require(:role).permit(:type, :department_id, :user_id, :organization_id))
  end
end
