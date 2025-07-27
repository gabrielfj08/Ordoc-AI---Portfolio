require 'rails_helper'

RSpec.describe 'Organizations', type: :request do
  let!(:organization) { create(:organization) }

  let(:credentials) do
    { 'X-Api-Subdomain' => organization.subdomain }
  end

  describe 'GET /organization' do
    it 'responds with status ok' do
      get '/organization', headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'returns the organization' do
      get '/organization', headers: credentials

      expect(JSON.parse(response.body)).to include(
        'id' => organization.id,
        'contact_name' => organization.contact_name,
        'contact_phone' => organization.contact_phone,
        'corporate_name' => organization.corporate_name,
        'cnpj' => organization.cnpj,
        'email' => organization.email,
        'logo_url' => organization.logo_url,
        'phone' => organization.phone,
        'prn' => organization.prn,
        'site' => organization.site,
        'subdomain' => organization.subdomain,
        'status' => organization.status,
        'storage_limit' => organization.storage_limit.to_s,
        'created_at' => organization.created_at.iso8601(3),
        'updated_at' => organization.updated_at.iso8601(3),
        'root_directory' => nil,
        'recycle_bin_directory' => nil
      )
    end
  end
end
