require 'rails_helper'

RSpec.describe 'PrinterAir::DocumentCopy', type: :request do
  let(:user) { create(:printer_cloud_user, :with_policies) }
  let(:document) { create(:printer_air_document, organization: user.organization) }
  let(:document_copy) { create(:document_copy, document: document) }

  let(:credentials) do
    { 'Authorization' => "Bearer #{user.token}",
      'X-Api-Subdomain' => user.organization.subdomain }
  end

  describe 'POST v3/printer_air/documents/:document_id/document_copies/' do
    it 'responds with status ok' do
      post "/v3/printer_air/documents/#{document.id}/document_copies", headers: credentials
      expect(response).to have_http_status(:ok)
    end

    it 'returns the created document copy' do
      post "/v3/printer_air/documents/#{document.id}/document_copies/", headers: credentials

      document_copy_id = JSON.parse(response.body)['id']
      document_copy = ::PrinterAir::DocumentCopy.find(document_copy_id)

      expect(JSON.parse(response.body)).to include(
        'id' => document_copy.id,
        'status' => document_copy.status,
        'document_id' => document_copy.document_id,
        'created_by_id' => document_copy.created_by_id,
        'created_at' => document_copy.created_at.iso8601(3),
        'updated_at' => document_copy.updated_at.iso8601(3)
      )
    end
  end

  describe 'GET v3/printer_air/documents/:document_id/document_copies/:id' do
    it 'responds with status ok' do
      get "/v3/printer_air/documents/#{document.id}/document_copies/#{document_copy.id}", headers: credentials
      expect(response).to have_http_status(:ok)
    end

    it 'returns the document copy' do
      get "/v3/printer_air/documents/#{document.id}/document_copies/#{document_copy.id}", headers: credentials

      expect(JSON.parse(response.body)).to include(
        'id' => document_copy.id,
        'status' => document_copy.status,
        'document_id' => document_copy.document_id,
        'created_by_id' => document_copy.created_by_id,
        'created_at' => document_copy.created_at.iso8601(3),
        'updated_at' => document_copy.updated_at.iso8601(3)
      )
    end
  end
end
