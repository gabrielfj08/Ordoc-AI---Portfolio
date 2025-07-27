require 'rails_helper'

RSpec.describe 'Organizations', type: :request do
  let(:user) { create(:user) }
  let(:organization) { create(:organization, corporate_name: 'My Organization') }
  let!(:recycle_bin) { create(:recycle_bin, organization: organization) }
  let!(:role) { create(:role, user: user, type: Roles::ORGANIZATION_MEMBER, organization: organization) }
  let(:authorization_headers) do
    { 'Authorization' => "Bearer #{user.token}" }
  end

  describe 'GET /member/organizations' do
    it 'returns the organizations' do
      get '/member/organizations', headers: authorization_headers
      expect(JSON.parse(response.body)).to include(
        'id' => organization.id,
        'contact_name' => 'some contact',
        'contact_phone' => '5541999999999',
        'corporate_name' => organization.corporate_name,
        'cnpj' => organization.cnpj,
        'email' => 'contact@example.com',
        'phone' => '5541999999999',
        'site' => 'www.fluxo.pro',
        'created_at' => organization.created_at.iso8601(3),
        'updated_at' => organization.updated_at.iso8601(3),
        'logo_url' => organization.logo_url,
        'deleted_at' => nil,
        'users_count' => organization.users_count,
        'managers_count' => organization.managers_count,
        'departments_count' => organization.departments.count,
        'apps' => [],
        'address' => nil,
        'status' => 'active',
        'recycle_bin' => {
          'id' => organization.recycle_bin.id,
          'organization_id' => organization.id
        }
      )
    end
  end

  describe 'GET /member/organizations/:id' do
    it 'returns the organization' do
      get "/member/organizations//#{organization.id}", headers: authorization_headers
      expect(JSON.parse(response.body)).to include(
        'id' => organization.id,
        'contact_name' => 'some contact',
        'contact_phone' => '5541999999999',
        'corporate_name' => organization.corporate_name,
        'apps' => [],
        'cnpj' => organization.cnpj,
        'email' => 'contact@example.com',
        'phone' => '5541999999999',
        'site' => 'www.fluxo.pro',
        'created_at' => organization.created_at.iso8601(3),
        'updated_at' => organization.updated_at.iso8601(3),
        'users_count' => organization.users_count,
        'managers_count' => organization.managers_count,
        'departments_count' => organization.departments.count,
        'recycle_bin' => {
          'id' => organization.recycle_bin.id,
          'organization_id' => organization.id
        }
      )
    end
  end
end
