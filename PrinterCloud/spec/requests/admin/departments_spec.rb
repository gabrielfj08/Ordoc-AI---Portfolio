require 'rails_helper'

RSpec.describe 'Departments', type: :request do
  let!(:department) { create(:department) }
  let!(:another_department) { create(:department) }
  let(:user) { create(:user, :admin) }
  let(:authorization_headers) do
    { 'Authorization' => "Bearer #{user.token}" }
  end

  describe 'GET /admin/departments' do
    it 'returns all departments' do
      get '/admin/departments', headers: authorization_headers

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

  describe 'GET /admin/departments/:id' do
    it 'returns the department' do
      get "/admin/departments/#{department.id}", headers: authorization_headers

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

  describe 'PUT /admin/departments/:id' do
    let(:update_params) do
      {
        department: {
          name: 'Updated Department',
          description: 'This department has been updated'
        }
      }
    end

    it 'returns the updated department' do
      put "/admin/departments/#{department.id}", headers: authorization_headers, params: update_params

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

  describe 'DELETE /admin/departments/:id' do
    it 'returns the deleted department' do
      get "/admin/departments/#{department.id}", headers: authorization_headers

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
