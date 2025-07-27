require 'rails_helper'

RSpec.describe 'Apps', type: :request do
  let(:user) { create(:user) }
  let(:organization) { create(:organization) }
  let!(:role) { create(:role, type: Roles::ORGANIZATION_MEMBER, user: user, organization: organization) }
  let(:authorization_headers) do
    { 'Authorization' => "Bearer #{user.token}" }
  end

  describe 'GET /member/organizations/:id/apps' do
    it 'returns the organizations apps' do
      get "/member/organizations/#{organization.id}/apps", headers: authorization_headers

      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body)).to eq([])
    end
  end
end
