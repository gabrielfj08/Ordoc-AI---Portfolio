require 'rails_helper'

RSpec.describe 'PrinterAir::ShareableLink', type: :request do
  let(:organization) { create(:organization) }
  let(:user) { create(:printer_cloud_user, organization: organization) }
  let!(:document) { create(:printer_air_document) }
  let!(:shareable_link) { create(:shareable_link, document_prn: document.prn, created_by: user) }

  describe 'GET /shareable_links/:uuid' do
    it 'responds with status ok' do
      get "/shareable_links/#{shareable_link.uuid}"
      expect(response).to have_http_status(:ok)
    end

    it 'return document' do
      get "/shareable_links/#{shareable_link.uuid}"
      expect(JSON.parse(response.body)).to include(
        {
          'id' => shareable_link.id,
          'uuid' => shareable_link.uuid,
          'expires_in' => shareable_link.expires_in,
          'expires_at' => shareable_link.expires_at.iso8601(3),
          'document_prn' => shareable_link.document_prn,
          'created_at' => shareable_link.created_at.iso8601(3),
          'updated_at' => shareable_link.updated_at.iso8601(3),
          'link' => shareable_link.link,
          'url' => shareable_link.url
        }
      )
    end
  end
end
