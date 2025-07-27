require 'rails_helper'

RSpec.describe 'Organizations', type: :request do
  let(:organization) { create(:organization) }
  let(:user) { create(:user) }
  let!(:organization_manager_role) { create(:role, :organization_manager, user: user, organization: organization) }
  let(:authorization_headers) do
    { 'Authorization' => "Bearer #{user.token}" }
  end

  describe 'GET /v2/air/organization_manager/organizations/:id' do
    it 'responds with status ok' do
      get "/v2/air/organization_manager/organizations/#{organization.id}", headers: authorization_headers

      expect(response).to have_http_status(:ok)
    end

    it 'renders a JSON response with the organization' do
      get "/v2/air/organization_manager/organizations/#{organization.id}", headers: authorization_headers

      expect(JSON.parse(response.body)).to include(
        'cnpj'            => organization.cnpj,
        'contact_name'    => organization.contact_name,
        'contact_phone'   => organization.contact_phone,
        'corporate_name'  => organization.corporate_name,
        'created_at'      => organization.created_at.iso8601(3),
        'email'           => organization.email,
        'id'              => organization.id,
        'logo_url'        => organization.logo_url,
        'phone'           => organization.phone,
        'site'            => organization.site,
        'updated_at'      => organization.updated_at.iso8601(3),
      )
    end
  end
end
