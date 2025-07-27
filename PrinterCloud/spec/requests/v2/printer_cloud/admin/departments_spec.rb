require 'rails_helper'

RSpec.describe 'Departments', type: :request do
  let!(:department) { create(:department) }
  let(:user) { create(:user, :admin) }
  let(:authorization_headers) do
    { 'Authorization' => "Bearer #{user.token}" }
  end

  describe 'GET /v2/printer_cloud/admin/departments' do

    it 'responds with status ok' do
      get '/v2/printer_cloud/admin/departments', headers: authorization_headers

      expect(response).to have_http_status(:ok)
    end

    it 'returns all departments' do
      get '/v2/printer_cloud/admin/departments', headers: authorization_headers

      expect(JSON.parse(response.body)).to include(
        'departments' => [{
          'id'                => department.id,
          'description'       => department.description,
          'name'              => department.name,
          'organization_id'   => department.organization_id,
          'updated_at'        => department.updated_at.iso8601(3),
          'created_at'        => department.created_at.iso8601(3),
          'users_count'       => department.users.count,
        }],
        'meta' => { 
          'total' => 1,
        },
      )
    end
  end
end
