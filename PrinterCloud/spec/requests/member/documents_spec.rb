require 'rails_helper'

RSpec.describe 'Documents', type: :request do
  include ActionView::Helpers::NumberHelper
  let(:organization) { create(:organization) }
  let(:department) { create(:department, organization: organization) }
  let!(:recycle_bin) { create(:recycle_bin, organization: organization) }
  let(:directory) { create(:directory, department: department) }
  let!(:document) { create(:document, directory: directory, department: department) }
  let(:user) { create(:user) }
  let(:destination_directory) { create(:directory, department: department) }
  let!(:role) { create(:role, type: Roles::DEPARTMENT_MEMBER, user: user, department: department) }
  let(:authorization_headers) do
    { 'Authorization' => "Bearer #{user.token}" }
  end

  describe 'GET /member/directories/:directory_id/documents' do
    it 'returns the documents' do
      get "/member/directories/#{directory.id}/documents", headers: authorization_headers

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
        'trashed_at' => nil,
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
          'status' => 'active',
          'unlock_token_sent_at' => nil
        },
        'description' => document.description,
        'location' => document.location,
        'path' => document.path,
        's3_key' => document.file.blob.key,
        'size' => document.size,
        'url' => document.url
      )
    end
  end

  describe 'POST /member/directories/:directory_id/documents/' do
    let(:file) { fixture_file_upload('file.png') }

    it 'creates a document' do
      post "/member/directories/#{directory.id}/documents",
           params: { file: file, document: { description: 'Descrição', location: 'Local' } }, headers: authorization_headers

      document_id = JSON.parse(response.body)['id']
      document = Document.find(document_id)

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
          'status' => 'active',
          'unlock_token_sent_at' => nil
        },
        'description' => document.description,
        'location' => document.location,
        'path' => document.path,
        's3_key' => document.file.blob.key,
        'size' => document.size,
        'url' => document.url,
        'permissions' => []
      )
    end
  end

  describe 'GET /member/directories/:directory_id/documents/:id' do
    it 'returns the document' do
      get "/member/directories/#{directory.id}/documents/#{document.id}", headers: authorization_headers

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
          'status' => 'active',
          'unlock_token_sent_at' => nil
        },
        'description' => document.description,
        'location' => document.location,
        'path' => document.path,
        's3_key' => document.file.blob.key,
        'size' => document.size,
        'url' => document.url,
        'permissions' => []
      )
    end
  end

  describe 'PUT /member/directories/:directory_id/documents/:id' do
    let(:update_params) do
      { document: {
        original_filename: 'Updated document',
        location: 'Paraná',
        description: 'Updated description'
      } }
    end

    it 'returns the updated document' do
      put "/member/directories/#{directory.id}/documents/#{document.id}", headers: authorization_headers,
                                                                          params: update_params

      document.reload

      expect(JSON.parse(response.body)).to include(
        'id' => document.id,
        'directory_id' => document.directory_id,
        'directory_name' => document.directory.name,
        'department_id' => document.directory.department_id,
        'department_name' => document.directory.department.name,
        'original_filename' => 'Updated document',
        'status' => document.status,
        'created_at' => document.created_at.iso8601(3),
        'updated_at' => document.updated_at.iso8601(3),
        'deleted_by_name' => nil,
        'deleted_at' => document.deleted_at,
        'updated_by' => {
          'id' => document.updated_by.id,
          'email' => document.updated_by.email,
          'created_at' => document.updated_by.created_at.iso8601(3),
          'updated_at' => document.updated_by.updated_at.iso8601(3),
          'name' => document.updated_by.name,
          'phone' => document.updated_by.phone,
          'prn' => document.updated_by.prn,
          'deleted_at' => document.updated_by.deleted_at,
          'date_of_birth' => '2021-01-15',
          'cpf' => document.updated_by.cpf,
          'status' => 'active',
          'unlock_token_sent_at' => nil
        },
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
          'status' => 'active',
          'unlock_token_sent_at' => nil
        },
        'description' => document.description,
        'location' => document.location,
        'path' => document.path,
        's3_key' => document.file.blob.key,
        'size' => document.size,
        'url' => document.url,
        'permissions' => []
      )
    end
  end

  describe 'DELETE /member/directories/:directory_id/documents/:id' do
    it 'returns the deleted document' do
      delete "/member/directories/#{directory.id}/documents/#{document.id}", headers: authorization_headers
      expect(response).to have_http_status(:ok)

      document.reload

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
        'deleted_at' => document.deleted_at&.iso8601(3),
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
          'status' => 'active',
          'unlock_token_sent_at' => nil
        },
        'description' => document.description,
        'location' => document.location,
        'path' => document.path,
        's3_key' => document.file.blob.key,
        'size' => document.size,
        'url' => document.url,
        'permissions' => []
      )
    end
  end

  describe 'PATCH /member/directories/:directory_id/documents/:id/move' do
    let(:move_params) do
      {
        to_directory_id: destination_directory.id
      }
    end
    it 'returns the moved document' do
      patch "/member/directories/#{directory.id}/documents/#{document.id}/move", headers: authorization_headers,
                                                                                 params: move_params

      document.reload

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
        'deleted_at' => nil,
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
          'status' => 'active',
          'unlock_token_sent_at' => nil
        },
        'description' => document.description,
        'location' => document.location,
        'path' => document.path,
        's3_key' => document.file.blob.key,
        'size' => document.size,
        'url' => document.url,
        'permissions' => []
      )
    end
  end
end
