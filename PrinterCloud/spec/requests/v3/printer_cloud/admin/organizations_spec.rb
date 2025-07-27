require 'rails_helper'

RSpec.describe 'PrinterCloud::Organization', type: :request do
  let!(:stub_env) { stub_const('ENV', 'EXTERNAL_USER_ID' => user.id) }
  let(:user) { create(:printer_cloud_user, :admin) }
  let(:credentials) do
    { 'Authorization' => "Bearer #{user.token}",
      'X-Api-Subdomain' => user.organization.subdomain }
  end

  describe 'POST /v3/printer_cloud/admin/organizations' do
    let(:params) do
      { organization: {
          cnpj: '04916444000122',
          corporate_name: 'Printer do Brasil',
          email: 'contato@printerdobrasil.com.br',
          logo_url: 'https://blog.centralserver.com.br/wp-content/uploads/2021/09/printer_do_brasil_logo.png',
          phone: '(41)3387-8613',
          contact_name: 'Aparecido Porfírio dos Santos',
          contact_phone: '9999999999',
          storage_limit: 0.0,
          site: 'www.printerdobrasil.com.br',
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
      post '/v3/printer_cloud/admin/organizations', params: params,
                                                    headers: credentials

      expect(response).to have_http_status(:created)
    end

    it 'renders a JSON with the created organization' do
      post '/v3/printer_cloud/admin/organizations', params: params, headers: credentials

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
        'prn' => organization.prn,
        'site' => organization.site,
        'status' => organization.status,
        'created_at' => organization.created_at.iso8601(3),
        'updated_at' => organization.updated_at.iso8601(3),
        'users_count' => organization.printer_cloud_users.count,
        'storage_limit' => organization.storage_limit.to_s,
        'apps' => [],
        'subdomain' => organization.subdomain,
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

  describe 'PUT /v3/printer_cloud/admin/organizations/:organization_id/set_up' do
    let(:organization) { create(:organization) }
    let(:params) do
      { organization: {
        user_id: user.id,
        apps: %i[printer_cloud printer_air]
      } }
    end

    it 'responds with status ok' do
      put "/v3/printer_cloud/admin/organizations/#{organization.id}/set_up", params: params,
                                                                             headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'renders a JSON with the organization' do
      put "/v3/printer_cloud/admin/organizations/#{organization.id}/set_up", params: params,
                                                                             headers: credentials

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
        'subdomain' => organization.subdomain,
        'address' => organization.address
      )
    end
  end
end
