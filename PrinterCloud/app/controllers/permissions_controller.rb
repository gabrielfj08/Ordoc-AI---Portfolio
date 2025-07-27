class PermissionsController < BaseController
  before_action :set_permission, only: [:show, :update, :destroy]

  # GET /permissions
  def index
    @permissions = current_user.permissions.kept + current_user.permissions_granted.kept
    
    render json: @permissions.uniq.paginate(page: params[:page]), each_serializer: PermissionSerializer::Base, status: :ok
  end

  # GET /permissions/1
  def show
    authorize! :read, @permission
    render json: @permission, serializer: PermissionSerializer::Show, status: :ok
  end

  # POST /permissions
  def create
    document = Document.find(params[:document_id])
    authorize! :manage, document
    
    @permission = Permission.new(create_params.merge(permission_granted_by: current_user))
    @permission.save!

    render json: @permission, status: :created
  end

  # PATCH/PUT /permissions/1
  def update
    authorize! :update, @permission
    if @permission.update(update_params)
      render json: @permission
    else
      render json: @permission.errors, status: :unprocessable_entity
    end
  end

  # DELETE /permissions/1
  def destroy
    authorize! :delete, @permission
    @permission.destroy
    render json: @permission, status: :ok
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_permission
      @permission = Permission.kept.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def create_params
      params.require(:permission).permit(:scope, :document_id, :directory_id, :user_id)
    end
    
    def update_params
      params.require(:permission).permit(:scope, :user_id)
    end

    def current_ability
      @current_ability ||= DepartmentMemberAbility.new(current_user)
    end
end
