require 'rails_helper'

RSpec.describe 'Base', type: :request do
  let(:organization) { create(:organization) }
  let(:authorization_headers) do
    { 'Authorization' => "Bearer #{user.token}" }
  end

  describe 'GET /v2/air/organization_manager/organizations/:id/healthcheck' do
    context 'when user is organization manager' do
      let(:user) { create(:user) }
      let!(:organization_manager_role) { create(:role, :organization_manager, user: user, organization: organization) }

      it 'responds with status ok' do
        get "/v2/air/organization_manager/organizations/#{organization.id}/healthcheck", headers: authorization_headers

        expect(response).to have_http_status(:ok)
      end

      it 'renders a JSON response with the healthcheck status' do
        get "/v2/air/organization_manager/organizations/#{organization.id}/healthcheck", headers: authorization_headers

        expect(JSON.parse(response.body)).to include(
          'status' => 'available',
        )
      end
    end

    context 'when user is admin' do
      let(:user) { create(:user, :admin) }

      it 'responds with status forbidden' do
        get "/v2/air/organization_manager/organizations/#{organization.id}/healthcheck", headers: authorization_headers

        expect(response).to have_http_status(:forbidden)
      end
    end

    context 'when user is organization member' do
      let(:user) { create(:user) }
      let!(:organization_member_role) { create(:role, :organization_member, user: user, organization: organization) }

      it 'responds with status forbidden' do
        get "/v2/air/organization_manager/organizations/#{organization.id}/healthcheck", headers: authorization_headers

        expect(response).to have_http_status(:forbidden)
      end
    end

    context 'when organization is inactive' do
      let(:user) { create(:user) }
      let(:organization) { create(:organization, status: :inactive) }
      let!(:organization_manager_role) { create(:role, :organization_manager, user: user, organization: organization) }

      it 'responds with status forbidden' do
        get "/v2/air/organization_manager/organizations/#{organization.id}/healthcheck", headers: authorization_headers

        expect(response).to have_http_status(:forbidden)
      end
    end
  end
end
