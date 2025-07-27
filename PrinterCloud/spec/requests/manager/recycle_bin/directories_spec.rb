require 'rails_helper'

RSpec.describe 'ReycleBin::Directories', type: :request do
  include ActionView::Helpers::NumberHelper
  let!(:organization) { create(:organization) }
  let!(:recycle_bin)  { create(:recycle_bin, organization: organization) }
  let!(:department) { create(:department, organization: organization) }
  let!(:directory) { create(:directory, department: department) }
  let!(:user) { create(:user) }
  let!(:destination_directory) { create(:directory, department: department) }
  let!(:role) { create(:role, type: Roles::ORGANIZATION_MANAGER, user: user, organization: organization) }

  let(:authorization_headers) do
    { 'Authorization' => "Bearer #{user.token}" }
  end

  describe 'GET /manager/recycle_bin/:recycle_bin_id/directories' do
    it 'returns the trashed directories' do
      directory.trash! user
      get "/manager/recycle_bin/#{recycle_bin.id}/directories", headers: authorization_headers
      expect(response).to have_http_status :ok
      expect(JSON.parse(response.body)).to include(
        'id' => directory.id,
        'name' => directory.name,
        'description' => directory.description,
        'department_id' => directory.department_id,
        'parent_directory_id' => directory.parent_directory_id,
        'created_at' => directory.created_at.iso8601(3),
        'updated_at' => directory.updated_at.iso8601(3),
        'trashed_at' => directory.trashed_at.iso8601(3),
        'trashed_by_name' => user.name,
        'used_storage' => directory.used_storage,
        'ancestor_directory_tree' => directory.ancestor_directory_tree,
        'created_by' => {
          'id' => directory.created_by.id,
          'email' => directory.created_by.email,
          'created_at' => directory.created_by.created_at.iso8601(3),
          'updated_at' => directory.created_by.updated_at.iso8601(3),
          'name' => directory.created_by.name,
          'phone' => directory.created_by.phone,
          'prn' => directory.created_by.prn,
          'cpf' => directory.created_by.cpf,
          'deleted_at' => directory.created_by.deleted_at,
          'date_of_birth' => '2021-01-15',
          'unlock_token_sent_at' => nil,
          'status' => 'active'
        },
        'updated_by' => nil
      )
    end
  end

  describe 'GET /manager/recycle_bin/:recycle_bin_id/directories/:id' do
    it 'returns the deleted directory' do
      directory.trash! user
      get "/manager/recycle_bin/#{recycle_bin.id}/directories/#{directory.id}", headers: authorization_headers
      expect(response).to have_http_status :ok

      expect(JSON.parse(response.body)).to include(
        'id' => directory.id,
        'name' => directory.name,
        'description' => directory.description,
        'department_id' => directory.department_id,
        'parent_directory_id' => directory.parent_directory_id,
        'created_at' => directory.created_at.iso8601(3),
        'updated_at' => directory.updated_at.iso8601(3),
        'trashed_by_name' => user.name,
        'used_storage' => directory.used_storage,
        'ancestor_directory_tree' => directory.ancestor_directory_tree,
        'created_by' => {
          'id' => directory.created_by.id,
          'email' => directory.created_by.email,
          'created_at' => directory.created_by.created_at.iso8601(3),
          'updated_at' => directory.created_by.updated_at.iso8601(3),
          'name' => directory.created_by.name,
          'phone' => directory.created_by.phone,
          'prn' => directory.created_by.prn,
          'cpf' => directory.created_by.cpf,
          'deleted_at' => directory.created_by.deleted_at,
          'date_of_birth' => '2021-01-15',
          'unlock_token_sent_at' => nil,
          'status' => 'active'
        },
        'updated_by' => nil
      )
    end
  end

  describe 'POST /manager/recycle_bin/:recycle_bin_id/directories/:directory_id/untrash' do
    it 'trashes the directory' do
      directory.trash! user
      expect do
        post "/manager/recycle_bin/#{recycle_bin.id}/directories/#{directory.id}/untrash",
             headers: authorization_headers
      end.to change(Directory.trashed, :count).by(-1)
    end
  end

  describe 'DELETE /manager/recycle_bin/:recycle_bin_id/directories/:directory_id/destroy' do
    it 'trashes the directory' do
      directory.trash! user
      expect do
        delete "/manager/recycle_bin/#{recycle_bin.id}/directories/#{directory.id}", headers: authorization_headers
      end.to change(Directory.kept, :count).by(-1)
    end
  end
end
