require 'rails_helper'

RSpec.describe 'Departments', type: :request do
  let(:user) { create(:user) }
  let(:organization) { create(:organization) }
  let(:department) { create(:department, organization: organization) }
  let!(:role) { create(:role, user: user, type: Roles::DEPARTMENT_MEMBER, department: department) }
  let(:authorization_headers) do
    { 'Authorization' => "Bearer #{user.token}" }
  end

  describe 'GET /member/departments' do
    it 'returns the departments' do
      get '/member/departments', headers: authorization_headers
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

  describe 'GET /member/departments/:id' do
    it 'returns the department' do
      get "/member/departments//#{department.id}", headers: authorization_headers
      expect(JSON.parse(response.body)).to include(
        'id' => department.id,
        'description' => department.description,
        'name' => department.name,
        'organization_id' => department.organization_id,
        'updated_at' => department.updated_at.iso8601(3),
        'created_at' => department.created_at.iso8601(3),
        'users' => [{
          'id' => user.id,
          'email' => user.email,
          'phone' => user.phone,
          'name' => 'John',
          'date_of_birth' => '2021-01-15',
          'cpf' => user.cpf,
          'created_at' => user.created_at.iso8601(3),
          'updated_at' => user.updated_at.iso8601(3),
          'current_sign_in_at' => nil,
          'current_sign_in_ip' => nil,
          'last_sign_in_at' => nil,
          'last_sign_in_ip' => nil,
          'status' => 'active',
          'roles' =>
            ['id' => role.id,
             'user_id' => role.user_id,
             'organization_id' => role.organization_id,
             'created_at' => role.created_at.iso8601(3),
             'updated_at' => role.updated_at.iso8601(3),
             'department_id' => role.department_id,
             'type' => 'DEPARTMENT_MEMBER'],
          'sign_in_count' => 0
        }]
      )
    end
  end
end
