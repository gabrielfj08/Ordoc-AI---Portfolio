require 'rails_helper'

RSpec.describe 'PrinterCloud::Organization', type: :request do
  let(:organization) { create(:organization, address: address) }
  let(:address) { create(:address) }
  let(:user) { create(:printer_cloud_user, :admin, :with_policies, organization: organization) }

  let(:credentials) do
    { 'Authorization' => "Bearer #{user.token}",
      'X-Api-Subdomain' => organization.subdomain }
  end

  describe 'GET /v3/printer_cloud/organizations' do
    it 'responds with status ok' do
      get '/v3/printer_cloud/organizations', headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'renders a JSON with all organizations' do
      get '/v3/printer_cloud/organizations', headers: credentials

      expect(JSON.parse(response.body)).to include(
        'organizations' => [{
          'id' => organization.id,
          'contact_name' => organization.contact_name,
          'contact_phone' => organization.contact_phone,
          'corporate_name' => organization.corporate_name,
          'cnpj' => organization.cnpj,
          'email' => organization.email,
          'logo_url' => organization.logo_url,
          'phone' => organization.phone,
          'prn' => organization.prn,
          'recycle_bin_directory' => organization.recycle_bin_directory,
          'site' => organization.site,
          'root_directory' => organization.root_directory,
          'status' => organization.status,
          'created_at' => organization.created_at.iso8601(3),
          'updated_at' => organization.updated_at.iso8601(3),
          'storage_limit' => organization.storage_limit.to_s,
          'subdomain' => organization.subdomain,
          'apps' => []
        }],
        'meta' => {
          'total' => 1
        }
      )
    end
  end

  describe 'GET /v3/printer_cloud/organizations/:id' do
    it 'responds with status ok' do
      get "/v3/printer_cloud/organizations/#{organization.id}", headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'renders a JSON with the organization' do
      get "/v3/printer_cloud/organizations/#{organization.id}", headers: credentials

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
        'status' => organization.status,
        'created_at' => organization.created_at.iso8601(3),
        'updated_at' => organization.updated_at.iso8601(3),
        'users_count' => organization.printer_cloud_users.count,
        'storage_limit' => organization.storage_limit.to_s,
        'subdomain' => organization.subdomain,
        'apps' => [],
        'address' => {
          'id' => organization.address.id,
          'number' => organization.address.number,
          'city' => organization.address.city,
          'complement' => organization.address.complement,
          'neighborhood' => organization.address.neighborhood,
          'postal_code' => organization.address.postal_code,
          'state' => organization.address.state,
          'street' => organization.address.street,
          'created_at' => organization.address.created_at.iso8601(3),
          'updated_at' => organization.address.updated_at.iso8601(3)
        }
      )
    end
  end

  describe 'PUT /v3/printer_cloud/organizations/:id' do
    let(:flow) { create(:app) }
    let(:params) do
      { organization: {
          cnpj: CNPJ.generate,
          app_ids: [flow.id]
        },
        address: {
          complement: '100'
        } }
    end

    it 'responds with status ok' do
      put "/v3/printer_cloud/organizations/#{organization.id}", params: params, headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'returns the updated organization' do
      put "/v3/printer_cloud/organizations/#{organization.id}", params: params, headers: credentials

      organization.reload

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
        'status' => organization.status,
        'created_at' => organization.created_at.iso8601(3),
        'updated_at' => organization.updated_at.iso8601(3),
        'users_count' => organization.printer_cloud_users.count,
        'storage_limit' => organization.storage_limit.to_s,
        'subdomain' => organization.subdomain,
        'apps' => [
          {
            'id' => flow.id,
            'name' => flow.name,
            'description' => flow.description,
            'created_at' => flow.created_at.iso8601(3),
            'prn' => flow.prn,
            'service' => flow.service,
            'updated_at' => flow.updated_at.iso8601(3)
          }
        ],
        'address' => {
          'id' => organization.address.id,
          'number' => organization.address.number,
          'city' => organization.address.city,
          'complement' => organization.address.complement,
          'neighborhood' => organization.address.neighborhood,
          'postal_code' => organization.address.postal_code,
          'state' => organization.address.state,
          'street' => organization.address.street,
          'created_at' => organization.address.created_at.iso8601(3),
          'updated_at' => organization.address.updated_at.iso8601(3)
        }
      )
    end
  end

  describe 'PUT /v3/printer_cloud/organizations/:id/activate' do
    let(:organization) { create(:organization, status: :inactive) }
    it 'responds with status ok' do
      put "/v3/printer_cloud/organizations/#{organization.id}/activate", headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'renders a JSON response with the active organization' do
      put "/v3/printer_cloud/organizations/#{organization.id}/activate", headers: credentials

      organization.reload

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
        'status' => organization.status,
        'created_at' => organization.created_at.iso8601(3),
        'updated_at' => organization.updated_at.iso8601(3),
        'users_count' => organization.printer_cloud_users.count,
        'storage_limit' => organization.storage_limit.to_s,
        'subdomain' => organization.subdomain,
        'apps' => []
      )
    end
  end

  describe 'PUT /v3/printer_cloud/organizations/:id/deactivate' do
    it 'responds with status ok' do
      put "/v3/printer_cloud/organizations/#{organization.id}/deactivate", headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'renders a JSON response with the inactive organization' do
      put "/v3/printer_cloud/organizations/#{organization.id}/deactivate", headers: credentials

      organization.reload

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
        'status' => organization.status,
        'created_at' => organization.created_at.iso8601(3),
        'updated_at' => organization.updated_at.iso8601(3),
        'users_count' => organization.printer_cloud_users.count,
        'storage_limit' => organization.storage_limit.to_s,
        'apps' => [],
        'address' => {
          'id' => organization.address.id,
          'number' => organization.address.number,
          'city' => organization.address.city,
          'complement' => organization.address.complement,
          'neighborhood' => organization.address.neighborhood,
          'postal_code' => organization.address.postal_code,
          'state' => organization.address.state,
          'street' => organization.address.street,
          'created_at' => organization.address.created_at.iso8601(3),
          'updated_at' => organization.address.updated_at.iso8601(3)
        }
      )
    end
  end

  describe 'DELETE /v3/printer_cloud/organizations/:id' do
    it 'responds with status ok' do
      delete "/v3/printer_cloud/organizations/#{organization.id}", headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'renders a JSON with the organization' do
      delete "/v3/printer_cloud/organizations/#{organization.id}", headers: credentials

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
        'status' => organization.status,
        'created_at' => organization.created_at.iso8601(3),
        'updated_at' => organization.updated_at.iso8601(3),
        'users_count' => organization.printer_cloud_users.count,
        'storage_limit' => organization.storage_limit.to_s,
        'subdomain' => organization.subdomain,
        'apps' => [],
        'address' => {
          'id' => organization.address.id,
          'number' => organization.address.number,
          'city' => organization.address.city,
          'complement' => organization.address.complement,
          'neighborhood' => organization.address.neighborhood,
          'postal_code' => organization.address.postal_code,
          'state' => organization.address.state,
          'street' => organization.address.street,
          'created_at' => organization.address.created_at.iso8601(3),
          'updated_at' => organization.address.updated_at.iso8601(3)
        }
      )
    end
  end
end
