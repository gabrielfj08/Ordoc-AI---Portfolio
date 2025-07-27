require 'rails_helper'

RSpec.describe 'Directories', type: :request do
  let(:user) { create(:user) }
  let(:organization) { create(:organization) }
  let(:department) { create(:department, organization: organization) }
  let!(:recycle_bin) { create(:recycle_bin, organization: organization) }
  let!(:directory) { create(:directory, department: department) }
  let!(:role) { create(:role, type: Roles::DEPARTMENT_MEMBER, user: user, department: department) }
  let!(:destination_department_role) do
    create(:role, type: Roles::DEPARTMENT_MEMBER, user: user, department: destination_department)
  end
  let(:destination_directory) { create(:directory, department: department) }
  let(:destination_department) { create(:department) }
  let(:authorization_headers) do
    { 'Authorization' => "Bearer #{user.token}" }
  end

  describe 'GET /member/directories' do
    it 'returns the directories' do
      get '/member/directories', headers: authorization_headers

      expect(JSON.parse(response.body)).to include(
        'department_id' => directory.department_id,
        'documents_count' => 0,
        'documents_count_with_subdirectories' => 0,
        'id' => directory.id,
        'children_directories_count' => directory.children_directories.count,
        'created_at' => directory.created_at.iso8601(3),
        'updated_at' => directory.updated_at.iso8601(3),
        'trashed_at' => nil,
        'parent_directory_id' => nil,
        'created_by' => {
          'cpf' => directory.created_by.cpf,
          'created_at' => directory.created_by.created_at.iso8601(3),
          'date_of_birth' => '2021-01-15',
          'deleted_at' => nil,
          'email' => directory.created_by.email,
          'id' => directory.created_by.id,
          'name' => 'John',
          'phone' => directory.created_by.phone,
          'prn' => directory.created_by.prn,
          'updated_at' => directory.created_by.updated_at.iso8601(3),
          'unlock_token_sent_at' => nil,
          'status' => 'active'
        },
        'updated_by' => nil,
        'description' => 'description',
        'name' => directory.name,
        'path' => directory.path
      )
    end
  end

  describe 'GET /member/directories/:id' do
    it 'returns the directory' do
      get "/member/directories/#{directory.id}", headers: authorization_headers

      expect(JSON.parse(response.body)).to include(
        'id' => directory.id,
        'name' => directory.name,
        'description' => directory.description,
        'department_id' => directory.department_id,
        'parent_directory_id' => nil,
        'created_at' => directory.created_at.iso8601(3),
        'updated_at' => directory.updated_at.iso8601(3),
        'ancestor_directory_tree' => [],
        'created_by' => {
          'cpf' => directory.created_by.cpf,
          'created_at' => directory.created_by.created_at.iso8601(3),
          'date_of_birth' => '2021-01-15',
          'deleted_at' => nil,
          'email' => directory.created_by.email,
          'id' => directory.created_by.id,
          'name' => 'John',
          'phone' => directory.created_by.phone,
          'prn' => directory.created_by.prn,
          'updated_at' => directory.created_by.updated_at.iso8601(3),
          'unlock_token_sent_at' => nil,
          'status' => 'active'
        },
        'updated_by' => nil
      )
    end
  end

  describe 'PUT /member/directories/:id' do
    let(:update_params) do
      {
        directory: {
          name: 'Administration',
          description: 'Administration services'
        }
      }
    end

    it 'returns the directory' do
      put "/member/directories/#{directory.id}", headers: authorization_headers, params: update_params

      directory.reload

      expect(JSON.parse(response.body)).to include(
        'id' => directory.id,
        'name' => 'Administration',
        'description' => 'Administration services',
        'department_id' => directory.department_id,
        'parent_directory_id' => nil,
        'created_at' => directory.created_at.iso8601(3),
        'updated_at' => directory.updated_at.iso8601(3),
        'ancestor_directory_tree' => [],
        'created_by' => {
          'cpf' => directory.created_by.cpf,
          'created_at' => directory.created_by.created_at.iso8601(3),
          'date_of_birth' => '2021-01-15',
          'deleted_at' => nil,
          'email' => directory.created_by.email,
          'id' => directory.created_by.id,
          'name' => 'John',
          'phone' => directory.created_by.phone,
          'prn' => directory.created_by.prn,
          'updated_at' => directory.created_by.updated_at.iso8601(3),
          'unlock_token_sent_at' => nil,
          'status' => 'active'
        },
        'updated_by' => {
          'id' => directory.updated_by.id,
          'email' => directory.updated_by.email,
          'created_at' => directory.updated_by.created_at.iso8601(3),
          'updated_at' => directory.updated_by.updated_at.iso8601(3),
          'name' => directory.updated_by.name,
          'phone' => directory.updated_by.phone,
          'prn' => directory.updated_by.prn,
          'deleted_at' => directory.updated_by.deleted_at,
          'date_of_birth' => '2021-01-15',
          'cpf' => directory.updated_by.cpf,
          'unlock_token_sent_at' => nil,
          'status' => 'active'
        }
      )
    end
  end

  describe 'PATCH /member/directories/:id/move' do
    describe 'when moving to a department' do
      let(:params) do
        {
          to: {
            department_id: destination_department.id
          }
        }
      end

      it 'moves to the new department' do
        expect do
          patch "/member/directories/#{directory.id}/move", params: params, headers: authorization_headers

          directory.reload
        end.to change(directory, :department_id).from(department.id).to(destination_department.id)
      end
    end

    describe 'when moving to a directory' do
      let(:params) do
        {
          to: {
            directory_id: destination_directory.id
          }
        }
      end

      it 'moves to the new directory' do
        expect do
          patch "/member/directories/#{directory.id}/move", params: params, headers: authorization_headers

          directory.reload
        end.to change(directory, :parent_directory_id).from(nil).to(destination_directory.id)
      end
    end
  end

  describe 'DELETE /member/directories/:id' do
    it 'returns the deleted directory' do
      delete "/member/directories/#{directory.id}", headers: authorization_headers

      directory.reload

      expect(JSON.parse(response.body)).to include(
        'id' => directory.id,
        'name' => directory.name,
        'description' => directory.description,
        'department_id' => directory.department_id,
        'parent_directory_id' => nil,
        'created_at' => directory.created_at.iso8601(3),
        'updated_at' => directory.updated_at.iso8601(3),
        'ancestor_directory_tree' => [],
        'created_by' => {
          'cpf' => directory.created_by.cpf,
          'created_at' => directory.created_by.created_at.iso8601(3),
          'date_of_birth' => '2021-01-15',
          'deleted_at' => nil,
          'email' => directory.created_by.email,
          'id' => directory.created_by.id,
          'name' => 'John',
          'phone' => directory.created_by.phone,
          'prn' => directory.created_by.prn,
          'updated_at' => directory.created_by.updated_at.iso8601(3),
          'unlock_token_sent_at' => nil,
          'status' => 'active'
        },
        'updated_by' => nil
      )
    end
  end
end
