class DecreesController < ApplicationController
  before_action :set_organization

  def show
    decree = ::PrinterCloud::Decree.find_by!(organization_id: @organization.id)

    render json: decree, serializer: ::V3::DecreeSerializer::Show, status: :ok
  end

  private

  def set_organization
    @organization = Organization.kept.find_by!(subdomain: request.headers['X-Api-Subdomain'])
  end
end
