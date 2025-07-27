require 'rails_helper'

RSpec.describe 'Organizations', type: :request do
  let!(:organization) { create(:organization) }
  let(:user) { create(:user, :admin, admin: true, id: 1) }
  let(:authorization_headers) do
    { 'Authorization' => "Bearer #{user.token}" }
  end

  describe 'POST /v2/printer_cloud/admin/organizations' do
    let(:params) do
      { organization: {
          cnpj: '04916444000122',
          corporate_name: 'Printer do Brasil',
          email: 'contato@printerdobrasil.com.br',
          phone: '(41)3387-8613',
          contact_name: 'Aparecido Porfírio dos Santos',
          contact_phone: '9999999999',
          site: 'www.printerdobrasil.com.br',
          storage_limit: 0.0,
          subdomain: 'printerdobrasil'
        },
        address: {
          street: 'Rua Desembargador Arthur Leme',
          number: '327',
          complement: 'n/a',
          postal_code: '82510-220',
          city: 'Curitiba',
          state: 'Paraná',
          neighborhood: 'Bacacheri'
        } }
    end

    it 'responds with status ok' do
      post '/v2/printer_cloud/admin/organizations', params: params, headers: authorization_headers

      expect(response).to have_http_status(:created)
    end

    it 'renders a JSON with the created organization' do
      post '/v2/printer_cloud/admin/organizations', params: params, headers: authorization_headers

      organization_id = JSON.parse(response.body)['id']
      organization = Organization.find(organization_id)

      expect(JSON.parse(response.body)).to include(
        'id' => organization.id,
        'contact_name' => organization.contact_name,
        'contact_phone' => organization.contact_phone,
        'corporate_name' => organization.corporate_name,
        'cnpj' => organization.cnpj,
        'email' => organization.email,
        'logo_url' => organization.logo_url,
        'phone' => organization.phone,
        'site' => organization.site,
        'status' => organization.status,
        'deleted_at' => nil,
        'created_at' => organization.created_at.iso8601(3),
        'updated_at' => organization.updated_at.iso8601(3),
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
          'updated_at' => organization.address.updated_at.iso8601(3),
          'deleted_at' => nil
        }
      )
    end
  end

  describe 'GET /v2/printer_cloud/admin/organizations' do
    it 'responds with status ok' do
      get '/v2/printer_cloud/admin/organizations', headers: authorization_headers

      expect(response).to have_http_status(:ok)
    end

    it 'renders a JSON with all organizations' do
      get '/v2/printer_cloud/admin/organizations', headers: authorization_headers

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
          'site' => organization.site,
          'status' => organization.status,
          'deleted_at' => nil,
          'created_at' => organization.created_at.iso8601(3),
          'updated_at' => organization.updated_at.iso8601(3),
          'storage_limit' => organization.storage_limit.to_s,
          'apps' => []
        }],
        'meta' => {
          'total' => 1
        }
      )
    end
  end

  describe 'GET /v2/printer_cloud/admin/organizations/:id' do
    it 'responds with status ok' do
      get "/v2/printer_cloud/admin/organizations/#{organization.id}", headers: authorization_headers

      expect(response).to have_http_status(:ok)
    end

    it 'renders a JSON with the organization' do
      get "/v2/printer_cloud/admin/organizations/#{organization.id}", headers: authorization_headers

      expect(JSON.parse(response.body)).to include(
        'id' => organization.id,
        'contact_name' => organization.contact_name,
        'contact_phone' => organization.contact_phone,
        'corporate_name' => organization.corporate_name,
        'cnpj' => organization.cnpj,
        'email' => organization.email,
        'logo_url' => organization.logo_url,
        'phone' => organization.phone,
        'site' => organization.site,
        'status' => organization.status,
        'deleted_at' => nil,
        'created_at' => organization.created_at.iso8601(3),
        'updated_at' => organization.updated_at.iso8601(3),
        'storage_limit' => organization.storage_limit.to_s,
        'apps' => [],
        'address' => nil
      )
    end
  end

  describe 'PUT /v2/printer_cloud/admin/organizations/:id' do
    let!(:address) { create(:address, addressable_id: organization.id) }
    let(:air) { create(:app) }
    let(:organization) { create(:organization) }
    let(:params) do
      { organization: {
          cnpj: CNPJ.generate,
          app_ids: [air.id]
        },
        address: {
          complement: '100'
        } }
    end

    it 'responds with status ok' do
      put "/v2/printer_cloud/admin/organizations/#{organization.id}", params: params, headers: authorization_headers

      expect(response).to have_http_status(:ok)
    end

    it 'returns the updated organization' do
      put "/v2/printer_cloud/admin/organizations/#{organization.id}", params: params, headers: authorization_headers

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
        'site' => organization.site,
        'status' => organization.status,
        'deleted_at' => nil,
        'created_at' => organization.created_at.iso8601(3),
        'updated_at' => organization.updated_at.iso8601(3),
        'storage_limit' => organization.storage_limit.to_s,
        'apps' => [
          {
            'id' => air.id,
            'name' => air.name,
            'description' => 'App description.',
            'created_at' => air.created_at.iso8601(3),
            'prn' => air.prn,
            'service' => air.service,
            'updated_at' => air.updated_at.iso8601(3)
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
          'updated_at' => organization.address.updated_at.iso8601(3),
          'deleted_at' => nil
        }
      )
    end
  end

  describe 'PUT /v2/printer_cloud/admin/organizations/:id/activate' do
    let(:organization) { create(:organization, status: :inactive) }
    it 'responds with status ok' do
      put "/v2/printer_cloud/admin/organizations/#{organization.id}/activate", headers: authorization_headers

      expect(response).to have_http_status(:ok)
    end

    it 'renders a JSON response with the active organization' do
      put "/v2/printer_cloud/admin/organizations/#{organization.id}/activate", headers: authorization_headers

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
        'site' => organization.site,
        'status' => organization.status,
        'deleted_at' => nil,
        'created_at' => organization.created_at.iso8601(3),
        'updated_at' => organization.updated_at.iso8601(3),
        'storage_limit' => organization.storage_limit.to_s,
        'apps' => [],
        'address' => nil
      )
    end
  end

  describe 'PUT /v2/printer_cloud/admin/organizations/:id/deactivate' do
    it 'responds with status ok' do
      put "/v2/printer_cloud/admin/organizations/#{organization.id}/deactivate", headers: authorization_headers

      expect(response).to have_http_status(:ok)
    end

    it 'renders a JSON response with the inactive organization' do
      put "/v2/printer_cloud/admin/organizations/#{organization.id}/deactivate", headers: authorization_headers

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
        'site' => organization.site,
        'status' => organization.status,
        'deleted_at' => nil,
        'created_at' => organization.created_at.iso8601(3),
        'updated_at' => organization.updated_at.iso8601(3),
        'storage_limit' => organization.storage_limit.to_s,
        'apps' => [],
        'address' => nil
      )
    end
  end

  describe 'DELETE /v2/printer_cloud/admin/organizations/:id' do
    it 'responds with status ok' do
      delete "/v2/printer_cloud/admin/organizations/#{organization.id}", headers: authorization_headers

      expect(response).to have_http_status(:ok)
    end

    it 'renders a JSON with the organization' do
      delete "/v2/printer_cloud/admin/organizations/#{organization.id}", headers: authorization_headers

      expect(JSON.parse(response.body)).to include(
        'id' => organization.id,
        'contact_name' => organization.contact_name,
        'contact_phone' => organization.contact_phone,
        'corporate_name' => organization.corporate_name,
        'cnpj' => organization.cnpj,
        'email' => organization.email,
        'logo_url' => organization.logo_url,
        'phone' => organization.phone,
        'site' => organization.site,
        'status' => organization.status,
        'deleted_at' => nil,
        'created_at' => organization.created_at.iso8601(3),
        'updated_at' => organization.updated_at.iso8601(3),
        'storage_limit' => organization.storage_limit.to_s,
        'apps' => [],
        'address' => nil
      )
    end
  end
end
