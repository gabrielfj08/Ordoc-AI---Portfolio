require 'rails_helper'

RSpec.describe 'Departments', type: :request do
  let!(:department) { create(:department, organization: organization) }
  let!(:organization) { create(:organization) }
  let!(:user) { create(:user) }
  let!(:role) { create(:role, type: Roles::ORGANIZATION_MANAGER, user: user, organization: organization) }
  let(:authorization_headers) do
   { 'Authorization' => "Bearer #{user.token}" }
  end

  describe 'GET /manager/departments' do
    it 'returns all departments' do
      get '/manager/departments', headers: authorization_headers

      expect(JSON.parse(response.body)).to include(
        'id' => department.id,
        'description' => department.description,
        'name' => department.name,
        'organization_id' => department.organization_id,
        'updated_at' => department.updated_at.iso8601(3),
        'created_at' => department.created_at.iso8601(3),
        'directories_count' => department.directories.count,
        'users_count' => department.users.count
       )
    end
  end

  describe 'GET /manager/departments/:id' do
    it 'returns the department' do
      get "/manager/departments/#{department.id}", headers: authorization_headers

      expect(JSON.parse(response.body)).to include(
        'id' => department.id,
        'description' => department.description,
        'name' => department.name,
        'organization_id' => department.organization_id,
        'updated_at' => department.updated_at.iso8601(3),
        'created_at' => department.created_at.iso8601(3),
        'users' => department.users
      )
    end
  end

  describe 'PUT /manager/departments/:id' do
    let(:update_params) do
      {
        department: {
          name: 'Updated Department',
          description: 'This department has been updated'
        }
      }
    end

    it 'returns the updated department' do
      put "/manager/departments/#{department.id}", headers: authorization_headers, params: update_params

        department.reload

      expect(JSON.parse(response.body)).to include(
        'id' => department.id,
        'description' => 'This department has been updated',
        'name' => 'Updated Department',
        'organization_id' => department.organization_id,
        'updated_at' => department.updated_at.iso8601(3),
        'created_at' => department.created_at.iso8601(3),
        'users' => department.users
      )
    end
  end

  describe 'DELETE /manager/departments/:id' do
    it 'returns the deleted department' do
      get "/manager/departments/#{department.id}", headers: authorization_headers

      expect(JSON.parse(response.body)).to include(
        'id' => department.id,
        'description' => department.description,
        'name' => department.name,
        'organization_id' => department.organization_id,
        'updated_at' => department.updated_at.iso8601(3),
        'created_at' => department.created_at.iso8601(3),
        'users' => department.users
       )
    end
  end
end
