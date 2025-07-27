require 'rails_helper'

RSpec.describe 'Organization Managers', type: :request do
  let(:organization) { create(:organization) }
  let(:user) { create(:user, :admin) }
  let(:authorization_headers) do
    { 'Authorization' => "Bearer #{user.token}" }
  end

  describe 'GET /v2/printer_cloud/admin/organization_managers' do
    let!(:role) { create(:role, type: Roles::ORGANIZATION_MANAGER, organization: organization, user: manager) }
    let(:manager) { create(:user) }
    let(:params) do
      {
        organization_id: organization.id 
      }
    end

    it 'responds with status ok' do
      get '/v2/printer_cloud/admin/organization_managers', params: params, headers: authorization_headers

      expect(response).to have_http_status(:ok)
    end

    it 'returns all managers from organization' do
      get '/v2/printer_cloud/admin/organization_managers', params: params, headers: authorization_headers

      expect(JSON.parse(response.body)).to include(
        'users' => [{
          'id'            => manager.id,
          'name'          => manager.name,
          'email'         => manager.email,
          'cpf'           => manager.cpf,
          'phone'         => manager.phone,
          'date_of_birth' => '2021-01-15',
          'status'        => manager.status,
          'created_at'    => manager.created_at.iso8601(3),
          'updated_at'    => manager.updated_at.iso8601(3),
          'deleted_at'    => manager.deleted_at,
        }],
        'meta' => {
          'total' => 1,
        },
      )
    end
  end

  describe 'DELETE /v2/printer_cloud/admin/organizations/:organization_id/organization_managers/:id' do
    let!(:role) { create(:role, type: Roles::ORGANIZATION_MANAGER, organization: organization, user: manager) }
    let(:manager) { create(:user) }

    it 'responds with status ok' do
      delete "/v2/printer_cloud/admin/organizations/#{organization.id}/organization_managers/#{manager.id}", headers: authorization_headers

      expect(response).to have_http_status(:ok)
    end

    it 'renders a JSON with the organization manager' do
      delete "/v2/printer_cloud/admin/organizations/#{organization.id}/organization_managers/#{manager.id}", headers: authorization_headers

      expect(JSON.parse(response.body)).to include(
          'id'              => role.id,
          'type'            => "ORGANIZATION_MANAGER",
          'user_id'         => manager.id,
          'organization_id' => organization.id,
          'department_id'   => nil,
          'created_at'      => role.created_at.iso8601(3),
          'updated_at'      => role.updated_at.iso8601(3),
      )
    end
  end
end
