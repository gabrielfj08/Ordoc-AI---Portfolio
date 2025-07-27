require 'rails_helper'

RSpec.describe 'PrinterAir::Document', type: :request do
  include ActionView::Helpers::NumberHelper
  let!(:document) { create(:printer_air_document, organization: organization) }
  let(:organization) { create(:organization) }
  let(:user) { create(:printer_cloud_user, :with_policies, organization: organization) }

  let(:credentials) do
    { 'Authorization' => "Bearer #{user.token}",
      'X-Api-Subdomain' => organization.subdomain }
  end

  describe 'GET v3/printer_air/documents' do
    it 'responds with status ok' do
      get '/v3/printer_air/documents', headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'returns all documents' do
      get '/v3/printer_air/documents', headers: credentials

      expect(JSON.parse(response.body)).to include(
        'printer_air/documents' => [
          {
            'created_at' => document.created_at.iso8601(3),
            'deleted_at' => nil,
            'description' => document.description,
            'directory_id' => document.directory.id,
            'id' => document.id,
            'location' => document.location,
            'original_filename' => document.original_filename,
            'shared' => document.shared?,
            'shareable_link' => document.has_link?,
            'path' => document.path,
            'previous_parent_prn' => document.previous_parent_prn,
            'prn' => document.prn,
            'status' => 'created',
            'updated_at' => document.updated_at.iso8601(3),
            'updated_by' => {
              'id' => document.updated_by.id,
              'name' => document.updated_by.name
            }
          }
        ],
        'meta' => {
          'total' => 1
        }
      )
    end
  end
  describe 'GET v3/printer_air/documents/:id' do
    it 'responds with status ok' do
      get "/v3/printer_air/documents/#{document.id}", headers: credentials
      expect(response).to have_http_status(:ok)
    end

    it 'return document' do
      get "/v3/printer_air/documents/#{document.id}", headers: credentials
      expect(JSON.parse(response.body)).to include(
        {
          'id' => document.id,
          'original_filename' => document.original_filename,
          'status' => 'created',
          'prn' => document.prn,
          'previous_parent_prn' => nil,
          'created_at' => document.created_at.iso8601(3),
          'created_by' => {
            'id' => document.created_by.id,
            'email' => document.created_by.email,
            'name' => document.created_by.name,
            'created_at' => document.created_by.created_at.iso8601(3),
            'updated_at' => document.created_by.updated_at.iso8601(3),
            'phone' => document.created_by.phone,
            'cpf' => document.created_by.cpf,
            'deleted_at' => nil,
            'date_of_birth' => '2021-01-15',
            'unlock_token_sent_at' => nil,
            'status' => document.created_by.status,
            'prn' => document.created_by.prn
          },
          'deleted_at' => nil,
          'description' => document.description,
          'directory' => {
            'name' => document.directory.name
          },
          'directory_id' => document.directory.id,
          'updated_at' => document.updated_at.iso8601(3),
          'location' => document.location,
          'url' => document.url,
          'download_url' => document.download_url,
          'path' => document.path,
          'size' => document.size,
          'byte_size' => document.byte_size,
          'updated_by' => {
            'id' => document.updated_by.id,
            'email' => document.updated_by.email,
            'name' => document.updated_by.name,
            'created_at' => document.updated_by.created_at.iso8601(3),
            'updated_at' => document.updated_by.updated_at.iso8601(3),
            'phone' => document.updated_by.phone,
            'cpf' => document.updated_by.cpf,
            'deleted_at' => nil,
            'date_of_birth' => '2021-01-15',
            'unlock_token_sent_at' => nil,
            'status' => document.updated_by.status,
            'prn' => document.updated_by.prn
          }
        }
      )
    end
  end

  describe 'PUT v3/printer_air/documents/:id' do
    let(:params) do
      {
        document: {
          description: 'Beto do backend.',
          location: '',
          original_filename: 'Potatos'
        }
      }
    end
    it 'responds with status ok' do
      put "/v3/printer_air/documents/#{document.id}", headers: credentials, params: params
      expect(response).to have_http_status(:ok)
    end

    it 'return the updated document' do
      put "/v3/printer_air/documents/#{document.id}", headers: credentials, params: params

      document.reload
      expect(JSON.parse(response.body)).to include(
        {
          'id' => document.id,
          'original_filename' => document.original_filename,
          'status' => 'created',
          'prn' => document.prn,
          'previous_parent_prn' => nil,
          'created_at' => document.created_at.iso8601(3),
          'created_by' => {
            'id' => document.created_by.id,
            'email' => document.created_by.email,
            'name' => document.created_by.name,
            'created_at' => document.created_by.created_at.iso8601(3),
            'updated_at' => document.created_by.updated_at.iso8601(3),
            'phone' => document.created_by.phone,
            'cpf' => document.created_by.cpf,
            'deleted_at' => nil,
            'date_of_birth' => '2021-01-15',
            'unlock_token_sent_at' => nil,
            'status' => document.created_by.status,
            'prn' => document.created_by.prn
          },
          'deleted_at' => nil,
          'description' => document.description,
          'directory' => {
            'name' => document.directory.name
          },
          'directory_id' => document.directory.id,
          'location' => document.location,
          'url' => document.url,
          'download_url' => document.download_url,
          'path' => document.path,
          'size' => document.size,
          'byte_size' => document.byte_size,
          'updated_at' => document.updated_at.iso8601(3),
          'updated_by' => {
            'id' => document.updated_by.id,
            'email' => document.updated_by.email,
            'name' => document.updated_by.name,
            'created_at' => document.updated_by.created_at.iso8601(3),
            'updated_at' => document.updated_by.updated_at.iso8601(3),
            'phone' => document.updated_by.phone,
            'cpf' => document.updated_by.cpf,
            'deleted_at' => nil,
            'date_of_birth' => '2021-01-15',
            'unlock_token_sent_at' => nil,
            'status' => document.updated_by.status,
            'prn' => document.updated_by.prn
          }
        }
      )
    end
  end

  describe 'GET v3/printer_air/documents/:id/download' do
    it 'responds with status ok' do
      get "/v3/printer_air/documents/#{document.id}/download", headers: credentials
      expect(response).to have_http_status(:ok)
    end

    it 'returns the document file' do
      get "/v3/printer_air/documents/#{document.id}/download", headers: credentials
      expect(response.body).to include(document.file.download)
    end
  end

  describe 'POST /v3/printer_air/documents/ocr' do
    let(:ocr_params) do
      {
        ids: [document.id]
      }
    end
    it 'responds with status ok' do
      post '/v3/printer_air/documents/ocr', params: ocr_params,
                                            headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'returns created directory' do
      post '/v3/printer_air/documents/ocr', params: ocr_params,
                                            headers: credentials

      batch_operation_id = JSON.parse(response.body)['id']
      batch_operation = ::PrinterAir::BatchOperation.find(batch_operation_id)

      expect(JSON.parse(response.body)).to include(
        'id' => batch_operation.id,
        'record_type' => 'PrinterAir::Document',
        'action' => batch_operation.action,
        'ids' => [document.id],
        'status' => batch_operation.status,
        'created_at' => batch_operation.created_at.iso8601(3),
        'updated_at' => batch_operation.updated_at.iso8601(3),
        'payload' => nil,
        'created_by_id' => batch_operation.created_by_id
      )
    end
  end

  describe 'POST /v3/printer_air/organizations/:organization_id/documents/move' do
    let(:destination_directory) { create(:printer_air_directory, organization: user.organization) }
    let(:params) do
      {
        batch_action: 'move_and_keep',
        ids: [document.id],
        payload: {
          directory_id: destination_directory.id
        }
      }
    end

    it 'responds with status ok' do
      post "/v3/printer_air/organizations/#{organization.id}/documents/move", params: params,
                                                                              headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'returns created directory' do
      post "/v3/printer_air/organizations/#{organization.id}/documents/move", params: params,
                                                                              headers: credentials

      batch_operation_id = JSON.parse(response.body)['id']
      batch_operation = ::PrinterAir::BatchOperation.find(batch_operation_id)

      expect(JSON.parse(response.body)).to include(
        'id' => batch_operation.id,
        'record_type' => 'PrinterAir::Document',
        'action' => batch_operation.action,
        'ids' => [document.id],
        'status' => batch_operation.status,
        'created_at' => batch_operation.created_at.iso8601(3),
        'updated_at' => batch_operation.updated_at.iso8601(3),
        'payload' => {
          'directory_id' => "#{destination_directory.id}"
        },
        'created_by_id' => batch_operation.created_by_id
      )
    end
  end

  describe 'POST v3/printer_air/organizations/:organization_id/documents/share' do
    let(:params) do
      {
        ids: [document.id],
        payload: {
          user_id: user.id
        }
      }
    end
    it 'responds with status ok' do
      post "/v3/printer_air/organizations/#{organization.id}/documents/share",
           headers: credentials, params: params

      expect(response).to have_http_status(:ok)
    end

    it 'creates a batch operation to share documents' do
      post "/v3/printer_air/organizations/#{organization.id}/documents/share",
           headers: credentials, params: params

      batch_operation_id = JSON.parse(response.body)['id']
      batch_operation = ::PrinterAir::BatchOperation.find(batch_operation_id)

      expect(JSON.parse(response.body)).to include(
        'id' => batch_operation.id,
        'record_type' => 'PrinterAir::Document',
        'action' => batch_operation.action,
        'ids' => [document.id],
        'status' => batch_operation.status,
        'created_at' => batch_operation.created_at.iso8601(3),
        'updated_at' => batch_operation.updated_at.iso8601(3),
        'payload' => {
          'user_id' => "#{user.id}"
        },
        'created_by_id' => batch_operation.created_by_id
      )
    end

    describe 'POST v3/printer_air/organizations/:organization_id/documents/trash' do
      let(:params) do
        {
          ids: [document.id]
        }
      end
      it 'responds with status ok' do
        post "/v3/printer_air/organizations/#{organization.id}/documents/trash",
             headers: credentials, params: params

        expect(response).to have_http_status(:ok)
      end

      it 'creates a batch operation to share documents' do
        post "/v3/printer_air/organizations/#{organization.id}/documents/trash",
             headers: credentials, params: params

        batch_operation_id = JSON.parse(response.body)['id']
        batch_operation = ::PrinterAir::BatchOperation.find(batch_operation_id)

        expect(JSON.parse(response.body)).to include(
          'id' => batch_operation.id,
          'record_type' => 'PrinterAir::Document',
          'action' => batch_operation.action,
          'ids' => [document.id],
          'status' => batch_operation.status,
          'created_at' => batch_operation.created_at.iso8601(3),
          'updated_at' => batch_operation.updated_at.iso8601(3),
          'payload' => nil,
          'created_by_id' => batch_operation.created_by_id
        )
      end
    end

    describe 'POST v3/printer_air/organizations/:organization_id/documents/restore' do
      let(:params) do
        {
          ids: [document.id]
        }
      end
      it 'responds with status ok' do
        post "/v3/printer_air/organizations/#{organization.id}/documents/restore",
             headers: credentials, params: params

        expect(response).to have_http_status(:ok)
      end

      it 'creates a batch operation to share documents' do
        post "/v3/printer_air/organizations/#{organization.id}/documents/restore",
             headers: credentials, params: params

        batch_operation_id = JSON.parse(response.body)['id']
        batch_operation = ::PrinterAir::BatchOperation.find(batch_operation_id)

        expect(JSON.parse(response.body)).to include(
          'id' => batch_operation.id,
          'record_type' => 'PrinterAir::Document',
          'action' => batch_operation.action,
          'ids' => [document.id],
          'payload' => batch_operation.payload,
          'status' => batch_operation.status,
          'created_at' => batch_operation.created_at.iso8601(3),
          'updated_at' => batch_operation.updated_at.iso8601(3),
          'created_by_id' => batch_operation.created_by_id
        )
      end
    end
  end
end
