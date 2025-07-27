# TODO: DEPRECATE CONTROLLER
module Manager
  class DocumentsController < ManagersController
    # TODO: DEPRECATE
    def count_by_organization
      query = <<-SQL
        SELECT COUNT(*)
        FROM documents
        JOIN directories
        ON documents.directory_id=directories.id
        JOIN departments
        ON directories.department_id=departments.id
        JOIN organizations
        ON departments.organization_id=organizations.id
        WHERE organizations.id=#{params[:organization_id]}
        AND documents.deleted_at IS NULL
      SQL

      result = ActiveRecord::Base.connection.execute(query)

      render json: { data: result.getvalue(0,0) || 0 }, status: :ok
    end

    def current_ability
      @current_ability ||= ManagerAbility.new(current_user)
    end
  end
end
