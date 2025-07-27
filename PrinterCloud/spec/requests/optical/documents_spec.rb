require 'rails_helper'

RSpec.describe 'Optical::Documents', type: :request do
  include ActionView::Helpers::NumberHelper
  let!(:role) { create(:role, type: Roles::DEPARTMENT_MEMBER, department: department, user: user) }
  let!(:document) { create(:document, inbox: user.inbox) }
  let(:department) { create(:department) }
  let(:directory) { create(:directory, department: department) }
  let(:user) { create(:user) }
  let(:file) { fixture_file_upload('file.png') }
  let(:authorization_headers) do
    { 'Authorization' => "Bearer #{user.token}" }
  end

  describe 'POST /optical/documents' do
    it 'creates a document' do
      post '/optical/documents', headers: authorization_headers, params: { file: file }

      document_id = JSON.parse(response.body)['id']
      document = Document.find(document_id)

      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body)).to include(
        'id' => document.id,
        'original_filename' => document.original_filename,
        'status' => document.status,
        'created_at' => document.created_at.iso8601(3),
        'size' => document.size,
        'url' => document.url
      )
    end
  end

  describe 'POST /optical/documents/batch' do
    let(:file2) { fixture_file_upload('sample.pdf') }

    it 'creates a document' do
      post '/optical/documents/batch', headers: authorization_headers, params: { files: [file, file2] }

      document_id = JSON.parse(response.body).first['id']
      document = Document.find(document_id)

      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body)).to include(
        'id' => document.id,
        'original_filename' => document.original_filename,
        'status' => document.status,
        'created_at' => document.created_at.iso8601(3),
        'size' => document.size,
        'url' => document.url
      )
    end
  end

  describe 'PATCH /optical/documents/:document_id/move' do
    it 'returns the moved document' do
      patch "/optical/documents/#{document.id}/move", headers: authorization_headers,
                                                      params: { to: { directory_id: directory.id } }

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
        's3_key' => document.file.blob.key,
        'size' => document.size,
        'url' => document.url,
        'permissions' => []
      )
    end
  end

  describe 'PATCH /optical/documents/move_batch' do
    let(:another_document) { create(:document, inbox: user.inbox) }
    it 'moves multiple documents to directory' do
      expect do
        patch '/optical/documents/move_batch',
              params: {
                document_ids: [document.id, another_document.id],
                to: {
                  directory_id: directory.id
                }
              }, headers: authorization_headers

        document.reload
        another_document.reload
      end.to change(document && another_document, :directory_id).to(directory.id)
    end
  end
end
