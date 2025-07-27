require 'rails_helper'

RSpec.describe 'PrinterAir::SharedObjects', type: :request do
  require 'rails_helper'
  let!(:shared_object) do
    create(:shared_object, :document, object_prn: document.prn, user: user, organization: organization)
  end
  let(:document) { create(:printer_air_document, organization: organization) }
  let(:organization) { create(:organization) }
  let(:user) { create(:printer_cloud_user, :with_policies, organization: organization) }

  let(:credentials) do
    { 'Authorization' => "Bearer #{user.token}",
      'X-Api-Subdomain' => organization.subdomain }
  end

  describe 'GET v3/printer_air/organizations/:organization_id/documents/:document_id/shared_objects' do
    it 'responds with status ok' do
      get "/v3/printer_air/organizations/#{organization.id}/documents/#{document.id}/shared_objects",
          headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'returns all shared objects from document' do
      get "/v3/printer_air/organizations/#{organization.id}/documents/#{document.id}/shared_objects",
          headers: credentials

      expect(JSON.parse(response.body)).to include(
        'printer_air/shared_objects' => [
          {
            'id' => shared_object.id,
            'parent_shared_id' => nil,
            'object_prn' => shared_object.object_prn,
            'organization_id' => shared_object.organization_id,
            'prn' => shared_object.prn,
            'created_by_id' => shared_object.created_by_id,
            'record_type' => 'PrinterAir::Document',
            'user' => {
              'id' => shared_object.user.id,
              'name' => shared_object.user.name,
              'avatar_url' => shared_object.user.avatar_url,
              'email' => shared_object.user.email
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

  describe 'DELETE v3/printer_air/organizations/:organization_id/shared_objects/:id' do
    it 'responds with status ok' do
      delete "/v3/printer_air/organizations/#{organization.id}/shared_objects/#{shared_object.id}",
             headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'deletes shared object' do
      delete "/v3/printer_air/organizations/#{organization.id}/shared_objects/#{shared_object.id}",
             headers: credentials

      expect(JSON.parse(response.body)).to include(
        'id' => shared_object.id,
        'parent_shared_id' => nil,
        'object_prn' => shared_object.object_prn,
        'organization_id' => shared_object.organization_id,
        'prn' => shared_object.prn,
        'created_by_id' => shared_object.created_by_id,
        'record_type' => 'PrinterAir::Document',
        'user' => {
          'id' => shared_object.user.id,
          'name' => shared_object.user.name,
          'avatar_url' => shared_object.user.avatar_url,
          'email' => shared_object.user.email
        },
        'created_at' => shared_object.created_at.iso8601(3),
        'updated_at' => shared_object.updated_at.iso8601(3)
      )
    end
  end
end
