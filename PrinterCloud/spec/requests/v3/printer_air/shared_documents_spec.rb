require 'rails_helper'

RSpec.describe 'PrinterAir::SharedDocument', type: :request do
  let!(:shared_object) do
    create(:shared_object, :document, object_prn: document.prn, user: user, organization: organization)
  end
  let(:organization) { create(:organization) }
  let(:document) { create(:printer_air_document, organization: organization) }
  let(:user) { create(:printer_cloud_user, :with_policies, organization: organization) }

  let(:credentials) do
    { 'Authorization' => "Bearer #{user.token}",
      'X-Api-Subdomain' => user.organization.subdomain }
  end

  describe ' GET v3/printer_air/organizations/:organization_id/shared_documents' do
    it 'responds with status ok' do
      get "/v3/printer_air/organizations/#{organization.id}/shared_documents",
          headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'returns all documents shared with the user' do
      get "/v3/printer_air/organizations/#{organization.id}/shared_documents",
          headers: credentials

      expect(JSON.parse(response.body)).to include(
        'printer_air/shared_objects' => [
          {
            'id' => shared_object.id,
            'parent_shared_id' => nil,
            'object_prn' => shared_object.object_prn,
            'organization_id' => shared_object.organization_id,
            'prn' => shared_object.prn,
            'user_id' => shared_object.user_id,
            'record_type' => 'PrinterAir::Document',
            'created_by' => {
              'id' => shared_object.created_by.id,
              'name' => shared_object.created_by.name
            },
            'document' => {
              'id' => shared_object.document.id,
              'original_filename' => shared_object.document.original_filename,
              'location' => shared_object.document.location,
              'description' => shared_object.document.description,
              'byte_size' => shared_object.document.byte_size,
              'url' => shared_object.document.url,
              'download_url' => shared_object.document.download_url
            },
            'created_at' => shared_object.created_at.iso8601(3),
            'updated_at' => shared_object.updated_at.iso8601(3)
          }
        ],
        'meta' => {
          'total' => 1
        }
      )
    end
  end
end
