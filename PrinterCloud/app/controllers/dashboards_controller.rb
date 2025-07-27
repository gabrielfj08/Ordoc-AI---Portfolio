class DashboardsController < BaseController
  include ActionView::Helpers::NumberHelper

  def organizations_count
    authorize! :read, Organization
    render json: { data: Organization.count }, status: :ok
  end

  def users_count
    authorize! :read, User
    users = User.kept.all
    filter_params.each do |key, value|
      users = users.public_send("filter_by_#{key}", value) if value.present?
    end
    users = users.filter_by_role(role_params[:type]) if role_params[:type].present?
    render json: { data: users.count }, status: :ok
  end

  def organization_active_users_count
    authorize! :read, User
    users = User.filter_by_organization_id(params[:organization_id]).where("current_sign_in_at >= (?)", 10.minutes.ago)
    render json: { data: users.count }, status: :ok
  end

  def departments_count
    authorize! :read, Department
    render json: { data: Department.count }, status: :ok
  end

  def directories_count
    authorize! :read, Directory
    render json: { data: Directory.count }, status: :ok
  end

  def documents_count
    authorize! :read, Document
    render json: { data: Document.count }, status: :ok
  end

  def used_storage
    acc_byte_size = Document.all.reduce(0) do |acc, document|
      document.file.attached? ? acc + document.file.attachment.byte_size : acc
    end

    render json: { data: number_to_human_size(acc_byte_size) }, status: :ok
  end

  private

  def filter_params
    params.permit(:organization_id)
  end

  # TODO: RAISE CUSTOM ERROR IF ROLE IS NOT WITHIN OPTIONS: ADMIN, ORGANIZATION_MANAGER, ORGANIZATION_MEMBER, DEPARTMENT_MEMBER
  def role_params
    Roles.map_params(params.permit(role: :type).fetch(:role, {}))
  end
end
