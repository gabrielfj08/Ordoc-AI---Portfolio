require 'rails_helper'

RSpec.describe 'Base', type: :request do
  let(:organization) { create(:organization) }
  let(:department) { create(:department, organization: organization) }
  let(:authorization_headers) do
    { 'Authorization' => "Bearer #{user.token}" }
  end

  context 'when user is admin' do
    let(:user) { create(:user, :admin) }

    it 'responds with status forbidden' do
      get '/v2/printer_cloud/admin/healthcheck', headers: authorization_headers

      expect(response).to have_http_status(:ok)
    end

    it 'renders a JSON response with the healthcheck status' do
      get '/v2/printer_cloud/admin/healthcheck', headers: authorization_headers

      expect(JSON.parse(response.body)).to include(
        'status' => 'available',
      )
    end
  end

  describe 'GET /v2/printer_cloud/admin/healthcheck' do
    context 'when user is department member' do
      let(:user) { create(:user) }
      let!(:department_member_role) { create(:role, :department_member, user: user, department: department) }

      it 'responds with status ok' do
        get '/v2/printer_cloud/admin/healthcheck', headers: authorization_headers

        expect(response).to have_http_status(:forbidden)
      end
    end

    context 'when user is organization manager' do
      let(:user) { create(:user, :organization_manager) }

      it 'responds with status forbidden' do
        get '/v2/printer_cloud/admin/healthcheck', headers: authorization_headers

        expect(response).to have_http_status(:forbidden)
      end
    end

    context 'when user is organization member' do
      let(:user) { create(:user) }
      let!(:organization_member_role) { create(:role, :organization_member, user: user, organization: organization) }

      it 'responds with status forbidden' do
        get '/v2/printer_cloud/admin/healthcheck', headers: authorization_headers

        expect(response).to have_http_status(:forbidden)
      end
    end
  end
end
