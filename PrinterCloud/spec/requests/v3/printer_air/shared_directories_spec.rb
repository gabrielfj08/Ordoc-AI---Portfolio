require 'rails_helper'

RSpec.describe 'PrinterAir::SharedDirectory', type: :request do
  let!(:shared_object) do
    create(:shared_object, :directory, object_prn: directory.prn, user: user, organization: organization)
  end
  let(:organization) { create(:organization) }
  let(:directory) { create(:printer_air_directory, organization: organization) }
  let(:user) { create(:printer_cloud_user, :with_policies, organization: organization) }

  let(:credentials) do
    { 'Authorization' => "Bearer #{user.token}",
      'X-Api-Subdomain' => organization.subdomain }
  end

  describe ' GET v3/printer_air/organizations/:organization_id/shared_directories' do
    it 'responds with status ok' do
      get "/v3/printer_air/organizations/#{organization.id}/shared_directories",
          headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'returns all directories shared with the user' do
      get "/v3/printer_air/organizations/#{organization.id}/shared_directories",
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
            'record_type' => 'PrinterAir::Directory',
            'path' => shared_object.path,
            'created_by' => {
              'id' => shared_object.created_by.id,
              'name' => shared_object.created_by.name
            },
            'directory' => {
              'id' => shared_object.directory.id,
              'name' => shared_object.directory.name,
              'description' => shared_object.directory.description
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
