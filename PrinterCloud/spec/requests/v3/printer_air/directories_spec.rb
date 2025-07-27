require 'rails_helper'

RSpec.describe 'PrinterAir::Directory', type: :request do
  let!(:directory) { create(:printer_air_directory, organization: organization) }
  let(:organization) { create(:organization, :with_root_directory) }
  let(:user) { create(:printer_cloud_user, :with_policies, organization: organization) }

  let(:credentials) do
    { 'Authorization' => "Bearer #{user.token}",
      'X-Api-Subdomain' => organization.subdomain }
  end

  describe 'GET /v3/printer_air/organizations/:organization_id/directories' do
    it 'responds with status ok' do
      get "/v3/printer_air/organizations/#{organization.id}/directories", headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'returns the directories' do
      get "/v3/printer_air/organizations/#{organization.id}/directories", headers: credentials

      expect(JSON.parse(response.body)).to include(
        'printer_air/directories' => [
          {
            'id' => directory.id,
            'name' => directory.name,
            'created_by_id' => directory.created_by_id,
            'description' => 'description',
            'organization_id' => directory.organization_id,
            'parent_directory_id' => directory.parent_directory_id,
            'path' => directory.path,
            'created_at' => directory.created_at.iso8601(3),
            'updated_at' => directory.updated_at.iso8601(3),
            'prn' => directory.prn,
            'shared' => directory.shared?,
            'previous_parent_prn' => directory.previous_parent_prn,
            'parent_directory' => {
              'id' => directory.parent_directory_id,
              'name' => directory.parent_directory.name
            },
            'updated_by' => { 'id' => directory.updated_by_id,
                              'name' => directory.updated_by.name }
          },
          {
            'id' => organization.root_directory.id,
            'name' => organization.root_directory.name,
            'created_by_id' => organization.root_directory.created_by_id,
            'description' => 'description',
            'organization_id' => organization.root_directory.organization_id,
            'parent_directory_id' => organization.root_directory.parent_directory_id,
            'path' => organization.root_directory.path,
            'created_at' => organization.root_directory.created_at.iso8601(3),
            'updated_at' => organization.root_directory.updated_at.iso8601(3),
            'prn' => organization.root_directory.prn,
            'shared' => organization.root_directory.shared?,
            'previous_parent_prn' => organization.root_directory.previous_parent_prn,
            'parent_directory' => nil,
            'updated_by' => { 'id' => organization.root_directory.updated_by_id,
                              'name' => organization.root_directory.updated_by.name }
          }
        ], 'meta' => { 'total' => 2 }
      )
    end
  end

  describe 'GET /v3/printer_air/directories/:id' do
    it 'responds with status ok' do
      get "/v3/printer_air/organizations/#{organization.id}/directories/#{directory.id}",
          headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'returns the directory' do
      get "/v3/printer_air/organizations/#{organization.id}/directories/#{directory.id}",
          headers: credentials

      expect(JSON.parse(response.body)).to include(
        'id' => directory.id,
        'name' => directory.name,
        'description' => 'description',
        'organization_id' => directory.organization_id,
        'parent_directory_id' => directory.parent_directory_id,
        'created_at' => directory.created_at.iso8601(3),
        'updated_at' => directory.updated_at.iso8601(3),
        'prn' => directory.prn,
        'path' => directory.path,
        'created_by' => { 'id' => directory.created_by_id,
                          'name' => directory.created_by.name },
        'updated_by' => { 'id' => directory.updated_by_id,
                          'name' => directory.updated_by.name },
        'parent_directory' => {
          'id' => directory.parent_directory_id,
          'name' => directory.parent_directory.name
        }
      )
    end
  end

  describe 'PUT /v3/printer_air/directories/:id' do
    let(:update_params) do
      {
        directory: {
          description: 'Pasta de Arquivos'
        }
      }
    end

    it 'responds with status ok' do
      put "/v3/printer_air/organizations/#{organization.id}/directories/#{directory.id}", params: update_params,
                                                                                          headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'returns updated directory' do
      put "/v3/printer_air/organizations/#{organization.id}/directories/#{directory.id}", params: update_params,
                                                                                          headers: credentials

      directory.reload

      expect(JSON.parse(response.body)).to include(
        'id' => directory.id,
        'name' => directory.name,
        'description' => 'Pasta de Arquivos',
        'organization_id' => directory.organization_id,
        'parent_directory_id' => directory.parent_directory_id,
        'created_at' => directory.created_at.iso8601(3),
        'updated_at' => directory.updated_at.iso8601(3),
        'parent_directory' => {
          'id' => directory.parent_directory_id,
          'name' => directory.parent_directory.name
        }
      )
    end
  end

  describe 'POST /v3/printer_air/directories' do
    let(:create_params) do
      {
        directory: {
          name: 'Arquivos',
          description: 'Pasta de Arquivos',
          parent_directory_id: directory.id
        }
      }
    end
    it 'responds with status ok' do
      post "/v3/printer_air/organizations/#{organization.id}/directories", params: create_params,
                                                                           headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'returns created directory' do
      post "/v3/printer_air/organizations/#{organization.id}/directories", params: create_params,
                                                                           headers: credentials

      directory_id = JSON.parse(response.body)['id']
      directory = ::PrinterAir::Directory.find(directory_id)

      expect(JSON.parse(response.body)).to include(
        'id' => directory.id,
        'name' => directory.name,
        'description' => 'Pasta de Arquivos',
        'organization_id' => directory.organization_id,
        'parent_directory_id' => directory.parent_directory_id,
        'created_at' => directory.created_at.iso8601(3),
        'updated_at' => directory.updated_at.iso8601(3),
        'prn' => directory.prn,
        'parent_directory' => { 'id' => directory.parent_directory_id,
                                'name' => directory.parent_directory.name }
      )
    end
  end

  describe 'POST /v3/printer_air/directories/move' do
    let(:destination_directory) { create(:printer_air_directory, organization: organization) }
    let(:params) do
      {
        batch_action: 'move_and_keep',
        ids: [directory.id],
        payload: {
          directory_id: destination_directory.id
        }
      }
    end
    it 'responds with status ok' do
      post "/v3/printer_air/organizations/#{organization.id}/directories/move", params: params,
                                                                                headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'returns created directory' do
      post "/v3/printer_air/organizations/#{organization.id}/directories/move", params: params,
                                                                                headers: credentials

      batch_operation_id = JSON.parse(response.body)['id']
      batch_operation = ::PrinterAir::BatchOperation.find(batch_operation_id)

      expect(JSON.parse(response.body)).to include(
        'id' => batch_operation.id,
        'record_type' => batch_operation.record_type,
        'action' => batch_operation.action,
        'status' => batch_operation.status,
        'ids' => [directory.id],
        'updated_at' => batch_operation.updated_at.iso8601(3),
        'created_at' => batch_operation.created_at.iso8601(3),
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
        ids: [directory.id],
        payload: {
          user_id: user.id
        }
      }
    end
    it 'responds with status ok' do
      post "/v3/printer_air/organizations/#{organization.id}/directories/share",
           headers: credentials, params: params

      expect(response).to have_http_status(:ok)
    end

    it 'creates a batch operation to share directories' do
      post "/v3/printer_air/organizations/#{organization.id}/directories/share",
           headers: credentials, params: params

      batch_operation_id = JSON.parse(response.body)['id']
      batch_operation = ::PrinterAir::BatchOperation.find(batch_operation_id)

      expect(JSON.parse(response.body)).to include(
        'id' => batch_operation.id,
        'record_type' => 'PrinterAir::Directory',
        'action' => batch_operation.action,
        'ids' => [directory.id],
        'status' => batch_operation.status,
        'created_at' => batch_operation.created_at.iso8601(3),
        'updated_at' => batch_operation.updated_at.iso8601(3),
        'payload' => {
          'user_id' => "#{user.id}"
        },
        'created_by_id' => batch_operation.created_by_id
      )
    end

    describe 'POST v3/printer_air/organizations/:organization_id/directories/trash' do
      let(:params) do
        {
          ids: [directory.id]
        }
      end
      it 'responds with status ok' do
        post "/v3/printer_air/organizations/#{organization.id}/directories/trash",
             headers: credentials, params: params

        expect(response).to have_http_status(:ok)
      end

      it 'creates a batch operation to trash directories' do
        post "/v3/printer_air/organizations/#{organization.id}/directories/trash",
             headers: credentials, params: params

        batch_operation_id = JSON.parse(response.body)['id']
        batch_operation = ::PrinterAir::BatchOperation.find(batch_operation_id)

        expect(JSON.parse(response.body)).to include(
          'id' => batch_operation.id,
          'record_type' => 'PrinterAir::Directory',
          'action' => batch_operation.action,
          'ids' => [directory.id],
          'status' => batch_operation.status,
          'created_at' => batch_operation.created_at.iso8601(3),
          'updated_at' => batch_operation.updated_at.iso8601(3),
          'payload' => nil,
          'created_by_id' => batch_operation.created_by_id
        )
      end
    end

    describe 'POST v3/printer_air/organizations/:organization_id/directories/restore' do
      let(:params) do
        {
          ids: [directory.id]
        }
      end
      it 'responds with status ok' do
        post "/v3/printer_air/organizations/#{organization.id}/directories/restore",
             headers: credentials, params: params

        expect(response).to have_http_status(:ok)
      end

      it 'creates a batch operation to restore directories' do
        post "/v3/printer_air/organizations/#{organization.id}/directories/restore",
             headers: credentials, params: params

        batch_operation_id = JSON.parse(response.body)['id']
        batch_operation = ::PrinterAir::BatchOperation.find(batch_operation_id)

        expect(JSON.parse(response.body)).to include(
          'id' => batch_operation.id,
          'record_type' => 'PrinterAir::Directory',
          'action' => batch_operation.action,
          'ids' => [directory.id],
          'status' => batch_operation.status,
          'created_at' => batch_operation.created_at.iso8601(3),
          'updated_at' => batch_operation.updated_at.iso8601(3),
          'payload' => nil,
          'created_by_id' => batch_operation.created_by_id
        )
      end
    end
  end
end
