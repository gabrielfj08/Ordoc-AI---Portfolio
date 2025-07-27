require 'rails_helper'

RSpec.describe 'Organizations', type: :request do
  let(:organization) { create(:organization) }
  let(:user) { create(:user) }
  let!(:organization_manager_role) { create(:role, :organization_manager, user: user, organization: organization) }
  let(:authorization_headers) do
    { 'Authorization' => "Bearer #{user.token}" }
  end

  describe 'GET /v2/air/organization_manager/organization/:id/dashboards/active_users_count' do
    it 'responds with status ok' do
      get "/v2/air/organization_manager/organizations/#{organization.id}/dashboards/active_users_count", headers: authorization_headers

      expect(response).to have_http_status(:ok)
    end

    it 'renders a JSON response with the organization' do
      get "/v2/air/organization_manager/organizations/#{organization.id}/dashboards/active_users_count", headers: authorization_headers

      expect(JSON.parse(response.body)).to include(
        'data' => organization.active_users.count,
      )
    end
  end

  describe 'GET /v2/air/organization_manager/organization/:id/dashboards/managers_count' do
    it 'responds with status ok' do
      get "/v2/air/organization_manager/organizations/#{organization.id}/dashboards/managers_count", headers: authorization_headers

      expect(response).to have_http_status(:ok)
    end

    it 'renders a JSON response with the organization' do
      get "/v2/air/organization_manager/organizations/#{organization.id}/dashboards/managers_count", headers: authorization_headers

      expect(JSON.parse(response.body)).to include(
        'data' => organization.managers.count,
      )
    end
  end

  describe 'GET /v2/air/organization_manager/organization/:id/dashboards/used_storage' do
    it 'responds with status ok' do
      get "/v2/air/organization_manager/organizations/#{organization.id}/dashboards/used_storage", headers: authorization_headers

      expect(response).to have_http_status(:ok)
    end

    it 'renders a JSON response with the organization' do
      get "/v2/air/organization_manager/organizations/#{organization.id}/dashboards/used_storage", headers: authorization_headers

      expect(JSON.parse(response.body)).to include(
        'data' => organization.used_storage,
      )
    end
  end
end
