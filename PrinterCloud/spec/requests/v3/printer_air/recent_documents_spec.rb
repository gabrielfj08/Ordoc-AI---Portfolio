require 'rails_helper'

RSpec.describe 'PrinterAir::RecentDocuments', type: :request do
  include ActionView::Helpers::NumberHelper
  let(:user) { create(:printer_cloud_user, :with_policies) }
  let(:document) { create(:printer_air_document, organization: user.organization) }
  let!(:recent_document) { create(:recent_document, document: document, user: user) }
  let(:credentials) do
    { 'Authorization' => "Bearer #{user.token}",
      'X-Api-Subdomain' => user.organization.subdomain }
  end

  describe 'GET v3/printer_air/recent_documents' do
    it 'responds with status ok' do
      get '/v3/printer_air/recent_documents', headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'returns all recent documents' do
      get '/v3/printer_air/recent_documents', headers: credentials

      expect(JSON.parse(response.body)).to include(
        {
          'printer_air/recent_documents' => [
            {
              'last_accessed_at' => recent_document.last_accessed_at.iso8601(3),
              'document_id' => document.id,
              'user_id' => user.id,
              'document' => {
                'description' => document.description,
                'directory_id' => document.directory_id,
                'id' => document.id,
                'prn' => document.prn,
                'location' => document.location,
                'original_filename' => document.original_filename,
                'path' => document.path,
                'status' => document.status,
                'size' => document.size,
                'url' => document.url,
                'created_at' => document.created_at.iso8601(3),
                'updated_at' => document.updated_at.iso8601(3)
              }
            }

          ], 'meta' => { 'total' => 1 }
        }
      )
    end
  end
end
