module Organizations
  class UsersController < BaseController
    def search_members
      members = User.kept
                    .accessible_by(current_ability)
                    .organization_member_by_organization_id(params[:organization_id])
                    .search_by(params[:q])
                    .paginate(page: params[:page])

      render json: members, each_serializer: UserSerializer::List, organization_id: params[:organization_id], status: :ok
    end

    def search_department_members
      department_members = User.kept
                               .accessible_by(current_ability)
                               .department_member_by_organization_id(params[:organization_id])
                               .search_by(params[:q])
                               .paginate(page: params[:page])

      render json: department_members, each_serializer: UserSerializer::List, organization_id: params[:organization_id], status: :ok
    end

    def search_managers
      managers = User.kept
                     .accessible_by(current_ability)
                     .manager_by_organization_id(params[:organization_id])
                     .search_by(params[:q])
                     .paginate(page: params[:page])

      render json: managers, each_serializer: UserSerializer::List, organization_id: params[:organization_id], status: :ok
    end

    def index_members
      members = User.kept
                    .accessible_by(current_ability)
                    .organization_member_by_organization_id(params[:organization_id])

      render json: members, each_serializer: UserSerializer::List, organization_id: params[:organization_id], status: :ok
    end
  end
end
