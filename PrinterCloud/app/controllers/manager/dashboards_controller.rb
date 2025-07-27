module Manager
  class DashboardsController < ManagersController
    before_action :set_organization, only: [:index]

    def index
      render status: :ok, json: [
        { slug: 'users_count', data: @organization.users_count },
        { slug: 'active_users_count', data: User.kept.where("current_sign_in_at >= (?)", 10.minutes.ago).count },
        { slug: 'managers_count', data: @organization.managers_count },
        { slug: 'used_storage', data: @organization.used_storage },
        { slug: 'departments_count', data: @organization.departments.kept.count },
        { slug: 'directories_count', data: @organization.directories.kept.count },
        { slug: 'documents_count', data: Document.kept.where(id: @organization.documents.pluck(:id)).count }
      ]
    end

    private

    def set_organization
      @organization = Organization.kept.find(params[:organization_id])
      authorize! :read, @organization
    end
  end
end
