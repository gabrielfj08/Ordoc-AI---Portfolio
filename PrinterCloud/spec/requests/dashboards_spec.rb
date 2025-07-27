require 'rails_helper'

RSpec.describe 'Dashboards', type: :request do
  let(:user) { create(:user, :admin) }
  let(:authorization_headers) do
    { 'Authorization' => "Bearer #{user.token}" }
  end
  let(:organization) { create(:organization) }
  let(:department) { create(:department, organization: organization) }


  describe 'GET /dashboards/organizations_count' do
    it 'returns the organizations count' do
      get '/dashboards/organizations_count', :headers => authorization_headers

      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body)['data']).to eq(0)
    end
  end

  describe 'GET /dashboards/users_count' do
    it 'returns the users count' do
      get '/dashboards/users_count', :headers => authorization_headers

      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body)['data']).to eq(1)
    end
  end

  describe 'GET /dashboards/users_count?role[type]=ORGANIZATION_MANAGER' do
    it 'returns the managers count' do
      get '/dashboards/users_count?role[type]=ORGANIZATION_MANAGER', :headers => authorization_headers

      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body)['data']).to eq(0)
    end
  end

  describe 'GET /dashboards/users_count?role[type]=ADMIN' do
    it 'returns the admins count' do
      get '/dashboards/users_count?role[type]=ADMIN', :headers => authorization_headers

      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body)['data']).to eq(1)
    end
  end
end
