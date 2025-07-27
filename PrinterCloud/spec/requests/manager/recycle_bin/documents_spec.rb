require 'rails_helper'

RSpec.describe 'ReycleBin::Documents', type: :request do
  include ActionView::Helpers::NumberHelper
  let!(:organization) { create(:organization) }
  let!(:recycle_bin)  { create(:recycle_bin, organization: organization) }
  let!(:department) { create(:department, organization: organization) }
  let!(:directory) { create(:directory, department: department) }
  let!(:document) { create(:document, directory: directory) }
  let!(:user) { create(:user) }
  let!(:destination_directory) { create(:directory, department: department) }
  let!(:role) { create(:role, type: Roles::ORGANIZATION_MANAGER, user: user, organization: organization) }
  let!(:authorization_headers) do
    { 'Authorization' => "Bearer #{user.token}" }
  end
  let!(:params) do
    {
      'recycle_bin_id' => recycle_bin.id
    }
  end

  describe 'GET /manager/recycle_bin/:recycle_bin_id/documents' do
    it 'returns the trashed documents' do
      document.trash! user
      get "/manager/recycle_bin/#{recycle_bin.id}/documents", headers: authorization_headers, params: params
      expect(response).to have_http_status :ok
      expect(JSON.parse(response.body)).to include(
        'id' => document.id,
        'directory_id' => document.directory_id,
        'directory_name' => document.directory.name,
        'department_id' => document.directory.department_id,
        'department_name' => document.directory.department.name,
        'original_filename' => document.original_filename,
        'status' => document.status,
        'created_at' => document.created_at.iso8601(3),
        'updated_at' => document.updated_at.iso8601(3),
        'trashed_at' => document.trashed_at.iso8601(3),
        'deleted_by_name' => nil,
        'deleted_at' => document.deleted_at,
        'updated_by' => document.updated_by,
        'created_by' => {
          'cpf' => document.created_by.cpf,
          'created_at' => document.created_by.created_at.iso8601(3),
          'date_of_birth' => '2021-01-15',
          'deleted_at' => nil,
          'email' => document.created_by.email,
          'id' => document.created_by.id,
          'name' => 'John',
          'phone' => document.created_by.phone,
          'prn' => document.created_by.prn,
          'updated_at' => document.created_by.updated_at.iso8601(3),
          'unlock_token_sent_at' => nil,
          'status' => 'active'
        },
        'trashed_by_name' => 'John',
        'permissions' => [],
        'description' => document.description,
        'location' => document.location,
        'path' => document.path,
        's3_key' => document.file.attachment.key,
        'size' => document.size,
        'url' => document.url
      )
    end
  end

  describe 'GET /manager/recycle_bin/:recycle_bin_id/documents/:id' do
    it 'returns the deleted document' do
      document.trash! user
      get "/manager/recycle_bin/#{recycle_bin.id}/documents/#{document.id}", headers: authorization_headers
      expect(response).to have_http_status :ok

      expect(JSON.parse(response.body)).to include(
        'id' => document.id,
        'directory_id' => document.directory_id,
        'directory_name' => document.directory.name,
        'department_id' => document.directory.department_id,
        'department_name' => document.directory.department.name,
        'original_filename' => document.original_filename,
        'status' => document.status,
        'created_at' => document.created_at.iso8601(3),
        'updated_at' => document.updated_at.iso8601(3),
        'deleted_by_name' => nil,
        'deleted_at' => document.deleted_at,
        'updated_by' => document.updated_by,
        'created_by' => {
          'cpf' => document.created_by.cpf,
          'created_at' => document.created_by.created_at.iso8601(3),
          'date_of_birth' => '2021-01-15',
          'deleted_at' => nil,
          'email' => document.created_by.email,
          'id' => document.created_by.id,
          'name' => 'John',
          'phone' => document.created_by.phone,
          'prn' => document.created_by.prn,
          'updated_at' => document.created_by.updated_at.iso8601(3),
          'unlock_token_sent_at' => nil,
          'status' => 'active'
        },
        'trashed_by_name' => 'John',
        'description' => document.description,
        'location' => document.location,
        'path' => document.path,
        's3_key' => document.file.attachment.key,
        'size' => document.size,
        'url' => document.url
      )
    end
  end

  describe 'POST /manager/recycle_bin/:recycle_bin_id/documents/:document_id/untrash' do
    it 'trashes the document' do
      document.trash! user
      expect do
        post "/manager/recycle_bin/#{recycle_bin.id}/documents/#{document.id}/untrash", headers: authorization_headers
      end.to change(Document.trashed, :count).by(-1)
    end
  end

  describe 'DELETE /manager/recycle_bin/:recycle_bin_id/documents/:document_id' do
    it 'trashes the document' do
      document.trash! user
      expect do
        delete "/manager/recycle_bin/#{recycle_bin.id}/documents/#{document.id}", headers: authorization_headers
      end.to change(Document.kept, :count).by(-1)
    end
  end
end
