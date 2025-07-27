module Admin
  class DashboardsController < AdminsController
    include ActionView::Helpers::NumberHelper

    def index
      render status: :ok, json: [
        { slug: 'organizations_count', data: Organization.all.count },
        { slug: 'users_count', data: User.all.count },
        { slug: 'active_users_count', data: User.where("current_sign_in_at >= (?)", 10.minutes.ago).count },
        { slug: 'managers_count', data: User.organization_manager.count },
        { slug: 'admins_count', data: User.admin.count },
        { slug: 'used_storage', data: number_to_human_size(ActiveStorage::Blob.sum('byte_size')) },
        { slug: 'departments_count', data: Department.count },
        { slug: 'directories_count', data: Directory.count },
        { slug: 'documents_count', data: Document.count }
      ]
    end
  end
end
