module Member
  class DepartmentsController < BaseController
    before_action :set_department, only: [:show]

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

    def count_by_organization
      organization = Organization.find(params[:organization_id])
      authorize! :read, organization
      count_departments = organization.departments.kept.accessible_by(current_ability).count
      
      render json: {data: count_departments}, status: :ok
    end

   def index_base
    departments = Department.kept
                            .filter_by_organization_id(params[:organization_id])
                            .accessible_by(current_ability)
                            .order_by(order_params)

    render json: departments, each_serializer: DepartmentSerializer::Base, status: :ok
   end

    private

    def filter_params
      params.permit(:name, :organization_id)
    end
  
    def order_params
      params.permit(:order, :direction)
    end

    def set_department
      @department = Department.kept.find(params[:id])
    end

    def current_ability
      @current_ability ||= DepartmentMemberAbility.new(current_user)
    end
  end
end
