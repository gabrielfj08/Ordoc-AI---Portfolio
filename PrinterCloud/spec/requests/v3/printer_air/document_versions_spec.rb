require 'rails_helper'

RSpec.describe 'PrinterAir::DocumentVersion', type: :request do
  let!(:document_version) do
    create(:printer_air_document, :version, directory: document.directory,
                                            original_filename: document.original_filename)
  end
  let(:user) { create(:printer_cloud_user, :with_policies, organization: organization) }
  let(:organization) { create(:organization) }
  let(:document) { create(:printer_air_document, organization: organization) }

  let(:credentials) do
    { 'Authorization' => "Bearer #{user.token}",
      'X-Api-Subdomain' => organization.subdomain }
  end

  describe 'GET v3/printer_air/organizations/:organization_id/document_versions' do
    it 'responds with status ok' do
      get "/v3/printer_air/organizations/#{organization.id}/document_versions", headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'returns all documents and versions' do
      get "/v3/printer_air/organizations/#{organization.id}/document_versions", headers: credentials

      expect(JSON.parse(response.body)).to include(
        'printer_air/documents' => [
          {
            'id' => document_version.id,
            'original_filename' => document_version.original_filename,
            'description' => document_version.description,
            'location' => document_version.location,
            'directory_id' => document_version.directory_id,
            'status' => document_version.status,
            'prn' => document_version.prn,
            'version_id' => document_version.version_id,
            'created_at' => document_version.created_at.iso8601(3),
            'updated_at' => document_version.updated_at.iso8601(3),
            'url' => document_version.download_url,
            'created_by' => {
              'id' => document_version.created_by.id,
              'name' => document_version.created_by.name
            }
          },
          {
            'id' => document.id,
            'original_filename' => document.original_filename,
            'description' => document.description,
            'location' => document.location,
            'status' => 'created',
            'prn' => document.prn,
            'version_id' => document.version_id,
            'directory_id' => document.directory_id,
            'created_at' => document.created_at.iso8601(3),
            'updated_at' => document.updated_at.iso8601(3),
            'url' => document.download_url,
            'created_by' => {
              'id' => document.created_by.id,
              'name' => document.created_by.name
            }
          }
        ],
        'meta' => {
          'total' => 2
        }
      )
    end
  end

  describe 'GET v3/organizations/:organization_id/document_versions/:id' do
    it 'responds with status ok' do
      get "/v3/printer_air/organizations/#{organization.id}/document_versions/#{document.id}",
          headers: credentials
      expect(response).to have_http_status(:ok)
    end

    it 'return the document' do
      get "/v3/printer_air/organizations/#{organization.id}/document_versions/#{document.id}",
          headers: credentials
      expect(JSON.parse(response.body)).to include(
        {
          'id' => document.id,
          'original_filename' => document.original_filename,
          'description' => document.description,
          'location' => document.location,
          'status' => document.status,
          'prn' => document.prn,
          'created_at' => document.created_at.iso8601(3),
          'created_by' => {
            'id' => document.created_by.id,
            'name' => document.created_by.name
          },
          'directory_id' => document.directory_id,
          'updated_at' => document.updated_at.iso8601(3),
          'url' => document.download_url
        }
      )
    end
  end

  describe 'DELETE v3/printer_air/organizations/:organization_id/document_versions/:document_version_id' do
    it 'responds with status ok' do
      delete "/v3/printer_air/organizations/#{organization.id}/document_versions/#{document.id}",
             headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'return the deleted document' do
      delete "/v3/printer_air/organizations/#{organization.id}/document_versions/#{document_version.id}",
             headers: credentials

      expect(JSON.parse(response.body)).to include(
        {
          'id' => document_version.id,
          'original_filename' => document_version.original_filename,
          'description' => document_version.description,
          'location' => document_version.location,
          'status' => document_version.status,
          'prn' => document_version.prn,
          'created_at' => document_version.created_at.iso8601(3),
          'created_by' => {
            'id' => document_version.created_by.id,
            'name' => document_version.created_by.name
          },
          'version_id' => 1,
          'directory_id' => document_version.directory_id,
          'url' => nil
        }
      )
    end
  end
end
