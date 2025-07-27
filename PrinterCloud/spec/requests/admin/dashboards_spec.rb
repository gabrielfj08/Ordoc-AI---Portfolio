require 'rails_helper'

RSpec.describe "Dashboards", type: :request do
  let(:user) { create(:user, :admin) }
  let(:authorization_headers) do
    { 'Authorization' => "Bearer #{user.token}" }
  end

  describe 'GET /admins/dashboards' do
    let!(:organization) { create(:organization) }

    it 'returns the organizations count' do
      get '/admin/dashboards', headers: authorization_headers

      expect(JSON.parse(response.body)).to include(
        'slug' => 'organizations_count',
        'data' => 1
      )
    end

    it 'returns the users count' do
      get '/admin/dashboards', headers: authorization_headers

      expect(JSON.parse(response.body)).to include(
        'slug' => 'users_count',
        'data' => 1
      )
    end

    it 'returns the active users count' do
      user.update(current_sign_in_at: Time.now)

      get '/admin/dashboards', headers: authorization_headers

      expect(JSON.parse(response.body)).to include(
        'slug' => 'active_users_count',
        'data' => 1
      )
    end

    it 'returns the managers count' do
      manager = create(:user, :organization_manager)
      get '/admin/dashboards', headers: authorization_headers

      expect(JSON.parse(response.body)).to include(
        'slug' => 'managers_count',
        'data' => 1
      )
    end

    it 'returns the admins count' do
      get '/admin/dashboards', headers: authorization_headers

      expect(JSON.parse(response.body)).to include(
        'slug' => 'admins_count',
        'data' => 1
      )
    end

    it 'returns the used storage' do
      get '/admin/dashboards', headers: authorization_headers

      expect(JSON.parse(response.body)).to include(
        'slug' => 'used_storage',
        'data' => '0 Bytes'
      )
    end

    it 'returns the departments count' do
      department = create(:department)

      get '/admin/dashboards', headers: authorization_headers

      expect(JSON.parse(response.body)).to include(
        'slug' => 'departments_count',
        'data' => 1
      )
    end
    
    it 'returns the directories count' do
      directory = create(:directory)

      get '/admin/dashboards', headers: authorization_headers

      expect(JSON.parse(response.body)).to include(
        'slug' => 'directories_count',
        'data' => 1
      )
    end

    it 'returns the documents count' do
      document = create(:document)

      get '/admin/dashboards', headers: authorization_headers

      expect(JSON.parse(response.body)).to include(
        'slug' => 'documents_count',
        'data' => 1
      )
    end
  end
end
