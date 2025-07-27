require 'rails_helper'

RSpec.describe 'Organizations', type: :request do
  let(:user) { create(:user) }
  let(:organization) { create(:organization, corporate_name: 'My Organization') }
  let!(:role) { create(:role, type: Roles::ORGANIZATION_MANAGER, user: user, organization: organization) }
  let(:authorization_headers) do
    { 'Authorization' => "Bearer #{user.token}" }
  end

  describe 'GET /manager/organizations' do
    it 'returns users_count and managers_count' do
      get '/manager/organizations', headers: authorization_headers
      expect(JSON.parse(response.body)).to match_array([ include("users_count" => organization.users_count, 
                                                                 "managers_count" => organization.managers_count) ])
    end
  end
end
