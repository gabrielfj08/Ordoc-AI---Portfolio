require 'rails_helper'

RSpec.describe 'Organizations', type: :request do
  let!(:organization) { create(:organization, corporate_name: 'My Organization') }
  let!(:address) do
    organization.create_address!(street: 'Rua Lamenha Lins', number: 1900, complement: 'apto 10', postal_code: '80820080',
                                 city: 'Curitiba', state: 'PR', neighborhood: 'Rebouças', addressable_id: organization.id)
  end
  let!(:recycle_bin) { create(:recycle_bin, organization: organization) }
  let(:user) { create(:user, :admin) }
  let!(:air) { create(:app) }
  let!(:other_app) { create(:app) }
  let(:authorization_headers) do
    { 'Authorization' => "Bearer #{user.token}" }
  end

  describe 'GET /admin/organizations' do
    it 'returns users_count and managers_count' do
      get '/admin/organizations', headers: authorization_headers
      expect(JSON.parse(response.body)).to match_array([include('users_count' => organization.users_count,
                                                                'managers_count' => organization.managers_count)])
    end
  end

  describe 'GET /admin/organizations/:id' do
    it 'returns the organization' do
      get "/admin/organizations//#{organization.id}", headers: authorization_headers
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
        'users_count' => organization.users_count,
        'managers_count' => organization.managers_count,
        'departments' => [],
        'apps' => [],
        'address' => { 'id' => address.id,
                       'addressable_id' => organization.id,
                       'addressable_type' => 'Organization',
                       'city' => 'Curitiba',
                       'complement' => 'apto 10',
                       'neighborhood' => 'Rebouças',
                       'postal_code' => '80820080',
                       'state' => 'PR',
                       'street' => 'Rua Lamenha Lins',
                       'number' => 1900,
                       'created_at' => address.created_at.iso8601(3),
                       'updated_at' => address.updated_at.iso8601(3),
                       'deleted_at' => nil },
        'used_storage' => '0 Bytes'
      )
    end

    describe 'PUT /admin/organizations/:id' do
      let(:update_params) do
        {
          organization: {
            corporate_name: 'Updated Organization',
            email: 'updatedorganization@example.com',
            site: 'www.updatedorg.com.br',
            address: {
              number: 1800
            },
            apps: [{
              id: air.id
            }]
          }
        }
      end

      it 'returns the updated organization' do
        put "/admin/organizations/#{organization.id}", headers: authorization_headers, params: update_params

        organization.reload
        address.reload
        air.reload
        other_app.reload

        expect(response).to have_http_status(:ok)
        expect(JSON.parse(response.body)).to include(
          'id' => organization.id,
          'contact_name' => 'some contact',
          'contact_phone' => '5541999999999',
          'corporate_name' => 'Updated Organization',
          'cnpj' => organization.cnpj,
          'email' => 'updatedorganization@example.com',
          'phone' => '5541999999999',
          'site' => 'www.updatedorg.com.br',
          'created_at' => organization.created_at.iso8601(3),
          'updated_at' => organization.updated_at.iso8601(3),
          'users_count' => organization.users_count,
          'managers_count' => organization.managers_count,
          'recycle_bin' => {
            'id' => organization.recycle_bin.id,
            'organization_id' => organization.id
          },
          'departments' => [],
          'apps' => [
            {
              'id' => air.id,
              'name' => air.name,
              'description' => air.description,
              'created_at' => air.updated_at.iso8601(3),
              'prn' => air.prn,
              'service' => air.service,
              'updated_at' => air.updated_at.iso8601(3)
            }
          ],
          'address' => {
            'id' => address.id,
            'number' => address.number,
            'city' => address.city,
            'complement' => address.complement,
            'neighborhood' => address.neighborhood,
            'postal_code' => address.postal_code,
            'state' => address.state,
            'street' => address.street,
            'addressable_type' => address.addressable_type,
            'addressable_id' => address.addressable_id,
            'created_at' => address.created_at.iso8601(3),
            'updated_at' => address.updated_at.iso8601(3),
            'deleted_at' => nil
          },
          'used_storage' => '0 Bytes'
        )
      end
    end

    describe 'DELETE /organizations/:id' do
      it 'destroy organization' do
        delete "/admin/organizations/#{organization.id}", headers: authorization_headers
        organization.reload
        address.reload
        expect expect(JSON.parse(response.body)).to include(
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
          'users_count' => 0,
          'used_storage' => '0 Bytes',
          'managers_count' => 0,
          'apps' => [],
          'departments' => [],
          'address' => { 'id' => address.id,
                         'number' => 1900,
                         'city' => 'Curitiba',
                         'complement' => 'apto 10',
                         'neighborhood' => 'Rebouças',
                         'postal_code' => '80820080',
                         'state' => 'PR',
                         'street' => 'Rua Lamenha Lins',
                         'addressable_type' => 'Organization',
                         'addressable_id' => address.addressable_id,
                         'created_at' => address.created_at.iso8601(3),
                         'updated_at' => address.updated_at.iso8601(3),
                         'deleted_at' => address.deleted_at.iso8601(3) }
        )
      end
    end
  end

  describe 'DELETE /admin/organizations/:id/really_destroy' do
    let!(:organization) { create(:organization, deleted_at: '2022-02-02 17:49:30.192711208 +0000') }

    it 'really destroy organization' do
      expect do
        delete "/admin/organizations/#{organization.id}/really_destroy", headers: authorization_headers
      end.to change { Organization.count }.by(-1)
    end

    it 'returns the destroyed user' do
      delete "/admin/organizations/#{organization.id}/really_destroy", headers: authorization_headers

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
        'users_count' => 0,
        'used_storage' => '0 Bytes',
        'managers_count' => 0,
        'apps' => [],
        'departments' => [],
        'address' => {
          'number' => 1900,
          'id' => address.id,
          'city' => 'Curitiba',
          'complement' => 'apto 10',
          'neighborhood' => 'Rebouças',
          'postal_code' => '80820080',
          'state' => 'PR',
          'street' => 'Rua Lamenha Lins',
          'addressable_type' => 'Organization',
          'addressable_id' => address.addressable_id,
          'created_at' => address.created_at.iso8601(3),
          'updated_at' => address.updated_at.iso8601(3),
          'deleted_at' => nil
        }
      )
    end
  end

  describe 'PATCH /admin/organizations/:id/restore' do
    let!(:organization) { create(:organization, deleted_at: '2022-02-02 17:49:30.192711208 +0000') }

    it 'restores the user' do
      expect do
        patch "/admin/organizations/#{organization.id}/restore", headers: authorization_headers
      end.to change { User.kept.count }.by(+1)
    end

    it 'returns the restored user' do
      patch "/admin/organizations/#{organization.id}/restore", headers: authorization_headers

      organization.reload

      expect(response).to have_http_status(:ok)
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
        'users_count' => 0,
        'used_storage' => '0 Bytes',
        'managers_count' => 0,
        'apps' => [],
        'departments' => [],
        'address' => {
          'number' => 1900,
          'id' => address.id,
          'city' => 'Curitiba',
          'complement' => 'apto 10',
          'neighborhood' => 'Rebouças',
          'postal_code' => '80820080',
          'state' => 'PR',
          'street' => 'Rua Lamenha Lins',
          'addressable_type' => 'Organization',
          'addressable_id' => address.addressable_id,
          'created_at' => address.created_at.iso8601(3),
          'updated_at' => address.updated_at.iso8601(3),
          'deleted_at' => nil
        }
      )
    end
  end
end
