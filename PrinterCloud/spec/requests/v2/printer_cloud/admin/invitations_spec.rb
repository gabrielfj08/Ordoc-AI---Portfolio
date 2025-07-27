require 'rails_helper'

RSpec.describe 'Users', type: :request do
  let(:user) { create(:user, :admin) }
  let(:authorization_headers) do
    { 'Authorization' => "Bearer #{user.token}" }
  end

  describe 'POST /v2/printer_cloud/admin/invitations' do
    context 'when inviting organization manager' do
      let(:manager) { create(:user) }
      let(:organization){ create(:organization) }
      let(:params) do 
      { 
        invitation: {
          email: manager.email,
          organization_id: organization.id,
          type: "ORGANIZATION_MANAGER"
        }
      }
      end

      it 'responds with status ok' do
        post "/v2/printer_cloud/admin/invitations", params: params, headers: authorization_headers
  
        expect(response).to have_http_status(:created)
      end

      it 'renders a JSON response with the created role' do
        post "/v2/printer_cloud/admin/invitations", params: params, headers: authorization_headers
  
        role_id = JSON.parse(response.body)['id']
        role = Role.find(role_id)

        expect(JSON.parse(response.body)).to include(
          "id"              => role.id,
          "type"            => "ORGANIZATION_MANAGER",
          "user_id"         => role.user_id,
          "organization_id" => role.organization_id,
          "department_id"   => nil,
          "created_at"      => role.created_at.iso8601(3),
          "updated_at"      => role.updated_at.iso8601(3),
        )
      end
    end

    context 'when inviting admin' do
      let(:admin) { create(:user) }
      let(:params) do 
      { 
        invitation: {
          email: admin.email,
          type: "ADMIN"
        }
      }
      end

      it 'responds with status ok' do
        post "/v2/printer_cloud/admin/invitations", params: params, headers: authorization_headers
  
        expect(response).to have_http_status(:created)
      end

      it 'renders a JSON response with the created role' do
        post "/v2/printer_cloud/admin/invitations", params: params, headers: authorization_headers
  
        role_id = JSON.parse(response.body)['id']
        role = Role.find(role_id)

        expect(JSON.parse(response.body)).to include(
          "id"              => role.id,
          "type"            => "ADMIN",
          "user_id"         => role.user_id,
          "department_id"   => nil,
          "organization_id" => nil,
          "created_at"      => role.created_at.iso8601(3),
          "updated_at"      => role.updated_at.iso8601(3),
        )
      end
    end
  end
end
