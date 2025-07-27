require 'rails_helper'

RSpec.describe 'PrinterAir::ShareableLinks', type: :request do
  let!(:shareable_link) { create(:shareable_link, document_prn: document.prn) }
  let(:document) { create(:printer_air_document, organization: organization) }
  let(:user) { create(:printer_cloud_user, :with_policies, organization: organization) }
  let(:organization) { create(:organization) }

  let(:credentials) do
    { 'Authorization' => "Bearer #{user.token}",
      'X-Api-Subdomain' => organization.subdomain }
  end

  describe 'GET v3/printer_air/organizations/:organization_id/documents/:document_id/shareable_links' do
    it 'responds with status ok' do
      get "/v3/printer_air/organizations/#{organization.id}/documents/#{document.id}/shareable_links",
          headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'returns all active shareable links from document' do
      get "/v3/printer_air/organizations/#{organization.id}/documents/#{document.id}/shareable_links",
          headers: credentials

      expect(JSON.parse(response.body)).to include(
        'printer_air/shareable_links' => [
          {
            'id' => shareable_link.id,
            'uuid' => shareable_link.uuid,
            'expires_in' => shareable_link.expires_in,
            'expires_at' => shareable_link.expires_at.iso8601(3),
            'document_prn' => shareable_link.document_prn,
            'created_at' => shareable_link.created_at.iso8601(3),
            'updated_at' => shareable_link.updated_at.iso8601(3),
            'link' => shareable_link.link,
            'created_by_id' => shareable_link.created_by_id,
            'created_by' => {  'id' => shareable_link.created_by.id,
                               'name' => shareable_link.created_by.name,
                               'email' => shareable_link.created_by.email,
                               'cpf' => shareable_link.created_by.cpf,
                               'date_of_birth' => shareable_link.created_by.date_of_birth.to_s,
                               'avatar_url' => shareable_link.created_by.avatar_url,
                               'organization_id' => shareable_link.created_by.organization_id,
                               'phone' => shareable_link.created_by.phone,
                               'prn' => shareable_link.created_by.prn,
                               'status' => shareable_link.created_by.status,
                               'username' => shareable_link.created_by.username,
                               'changed_password' => shareable_link.created_by.changed_password,
                               'registration_number' => shareable_link.created_by.registration_number,
                               'created_at' => shareable_link.created_by.created_at.iso8601(3),
                               'updated_at' => shareable_link.created_by.updated_at.iso8601(3),
                               'deleted_at' => shareable_link.created_by.deleted_at }
          }
        ],
        'meta' => {
          'total' => 1
        }
      )
    end
  end

  describe 'POST v3/printer_air/organizations/:organization_id/documents/:document_id/shareable_links' do
    let(:create_params) do
      {
        shareable_link: {
          expires_in: 300
        }
      }
    end
    it 'responds with status ok' do
      post "/v3/printer_air/organizations/#{organization.id}/documents/#{document.id}/shareable_links", params: create_params,
                                                                                                        headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'returns created shareable link' do
      post "/v3/printer_air/organizations/#{organization.id}/documents/#{document.id}/shareable_links", params: create_params,
                                                                                                        headers: credentials

      shareable_link_id = JSON.parse(response.body)['id']
      shareable_link = ::PrinterAir::ShareableLink.find(shareable_link_id)

      expect(JSON.parse(response.body)).to include(
        'id' => shareable_link.id,
        'uuid' => shareable_link.uuid,
        'expires_in' => shareable_link.expires_in,
        'expires_at' => shareable_link.expires_at.iso8601(3),
        'document_prn' => shareable_link.document_prn,
        'created_at' => shareable_link.created_at.iso8601(3),
        'updated_at' => shareable_link.updated_at.iso8601(3),
        'link' => shareable_link.link,
        'created_by_id' => shareable_link.created_by_id
      )
    end
  end
end
