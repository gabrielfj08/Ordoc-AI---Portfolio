module Air
  class PermissionsController < BaseController
    before_action :set_resource, only: [:index, :update, :destroy]
    before_action :set_permission, only: [:show, :update, :destroy]
    load_ability :permission, :document, :directory

    def index
      @permissions = @resource.permissions.kept
                              .accessible_by(current_ability)
                              .paginate(page: params[:page])

      render json: @permissions, each_serializer: PermissionSerializer::List, status: :ok
    end

    def show
    end

    def create
      @permission = Permission.new(create_params.merge(permission_granted_by: current_user))
      authorize! :create, @permission

      @permission.save!

      render json: @permission, serializer: PermissionSerializer::Show, status: :created
    end

    def update
      authorize! :update, @permission

      @permission.update!(update_params)
      render json: @permission, serializer: PermissionSerializer::Show, status: :ok
    end

    def destroy
      authorize! :destroy, @permission

      @permission.destroy!
      render json: @permission, serializer: PermissionSerializer::Show, status: :ok
    end

    private

    def create_params
      params.permit(:scope, :document_id, :directory_id, :user_id)
    end

    def update_params
      params.permit(:scope)
    end

    def set_resource
      if params[:document_id].present?
        @resource = set_document
      else
        @resource = set_directory
      end

      authorize! :update, @resource
    end

    def set_permission
      @permission = @resource.permissions.find(params[:id])
    end

    def set_document
      @document = Document.kept.find(params[:document_id])
      authorize! :read, @document
    end

    def set_directory
      @directory = Directory.kept.find(params[:directory_id])
      authorize! :read, @directory
    end
  end
end
