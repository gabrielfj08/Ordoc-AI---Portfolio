module Manager
  class DepartmentsController < ManagersController
    before_action :set_department, only: [:show, :update, :destroy]

    def index
      departments = Department.kept
                              .accessible_by(current_ability)
                              .filter_by(filter_params)
                              .order_by(order_params)
                              .paginate(page: params[:page])

      render json: departments, each_serializer: DepartmentSerializer::List, status: :ok
    end

    def show
      authorize! :read, @department
      render json: @department, serializer: DepartmentSerializer::Show, status: :ok
    end

    def create
      department = Department.new(create_params)
      authorize! :create, department
      department.save!
      render json: department, serializer: DepartmentSerializer::Show, status: :created
    end

    def update
     authorize! :update, @department
     @department.update!(update_params)
     render json: @department, serializer: DepartmentSerializer::Show, status: :ok
    end

    def destroy
      authorize! :destroy, @department
      @department.discard
      render json: @department, serializer: DepartmentSerializer::Show, status: :ok
    end

    def count_by_organization
      organization = Organization.kept.find(params[:organization_id])
      authorize! :read, organization
      count_departments = organization.departments.kept.accessible_by(current_ability).count
      
      render json: {data: count_departments}, status: :ok
    end

    private

    def create_params
      params.require(:department).permit(:name, :description, :organization_id)
    end

    def update_params
      params.require(:department).permit(:name, :description)
    end

    def filter_params
      params.permit(:name, :organization_id, :role_member)
    end

    def order_params
      params.permit(:order, :direction)
    end

    def current_ability
      @current_ability ||= ManagerAbility.new(current_user)
    end

    def set_department
      @department = Department.kept.find(params[:id])
    end
  end
end
