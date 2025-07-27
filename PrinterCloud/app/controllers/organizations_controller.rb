class OrganizationsController < ApplicationController
  before_action :set_organization
  def organization
    render json: @organization, serializer: V3::OrganizationSerializer::Organization, status: :ok
  end

  private

  def set_organization
    @organization = Organization.kept.find_by!(subdomain: request.headers['X-Api-Subdomain'])
  end
end
