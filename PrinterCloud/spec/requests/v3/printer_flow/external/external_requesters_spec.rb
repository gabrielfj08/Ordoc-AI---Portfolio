require 'rails_helper'

RSpec.describe 'PrinterFlow::ExternalRequester', type: :request do
  let!(:address) { create(:address, addressable: requester) }
  let(:requester) { create(:external_requester) }

  let(:credentials) do
    { 'Authorization' => "Bearer #{requester.token}",
      'X-Api-Subdomain' => requester.organization.subdomain }
  end

  describe 'GET v3/printer_flow/external/external_requesters/me' do
    it 'responds with status ok' do
      get '/v3/printer_flow/external/external_requesters/me', headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'renders a JSON with external requester' do
      get '/v3/printer_flow/external/external_requesters/me', headers: credentials

      expect(JSON.parse(response.body)).to include(
        {
          'id' => requester.id,
          'name' => requester.name,
          'email' => requester.email,
          'cpf_cnpj' => requester.cpf_cnpj,
          'birth_date' => requester.birth_date.to_s,
          'phone' => requester.phone,
          'optional_email' => requester.optional_email,
          'optional_phone' => requester.optional_phone,
          'occupation' => requester.occupation,
          'notification' => requester.notification,
          'status' => requester.status,
          'prn' => requester.prn,
          'organization_id' => requester.organization_id,
          'changed_password' => requester.changed_password,
          'created_at' => requester.created_at.iso8601(3),
          'updated_at' => requester.updated_at.iso8601(3),
          'blocked' => requester.blocked
        }
      )
    end
  end

  describe 'PUT v3/printer_flow/external/external_requesters/:requester_id/update_password' do
    let(:params) do
      {
        current_password: requester.password,
        password: '987654321!Ab',
        password_confirmation: '987654321!Ab'
      }
    end

    it 'responds with status ok' do
      put "/v3/printer_flow/external/external_requesters/#{requester.id}/update_password", params: params,
                                                                                           headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'renders a JSON with external requester' do
      put "/v3/printer_flow/external/external_requesters/#{requester.id}/update_password", params: params,
                                                                                           headers: credentials

      requester.reload

      expect(JSON.parse(response.body)).to include(
        {
          'id' => requester.id,
          'name' => requester.name,
          'email' => requester.email,
          'cpf_cnpj' => requester.cpf_cnpj,
          'birth_date' => requester.birth_date.to_s,
          'phone' => requester.phone,
          'optional_email' => requester.optional_email,
          'optional_phone' => requester.optional_phone,
          'occupation' => requester.occupation,
          'notification' => requester.notification,
          'status' => requester.status,
          'prn' => requester.prn,
          'organization_id' => requester.organization_id,
          'changed_password' => requester.changed_password,
          'created_at' => requester.created_at.iso8601(3),
          'updated_at' => requester.updated_at.iso8601(3),
          'blocked' => requester.blocked,
          'address' => {
            'id' => requester.address.id,
            'number' => requester.address.number,
            'city' => requester.address.city,
            'complement' => requester.address.complement,
            'neighborhood' => requester.address.neighborhood,
            'postal_code' => requester.address.postal_code,
            'state' => requester.address.state,
            'street' => requester.address.street,
            'created_at' => requester.address.created_at.iso8601(3),
            'updated_at' => requester.address.updated_at.iso8601(3)
          }
        }
      )
    end
  end

  describe 'PUT v3/printer_flow/external/external_requesters/:id' do
    let(:update_params) do
      {
        "external_requester": {
          name: 'Ana Bolena',
          email: 'ana@email.com',
          phone: '41987257638'
        },
        "address": {
          street: 'Rua Desembargador Arthur Leme',
          number: 327,
          complement: 'n/a',
          postal_code: '82510220',
          city: 'Curitiba',
          state: 'Paraná',
          neighborhood: 'Bacacheri'
        }
      }
    end
    it 'responds with status ok' do
      put "/v3/printer_flow/external/external_requesters/#{requester.id}", params: update_params,
                                                                           headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'renders a JSON with external requester' do
      put "/v3/printer_flow/external/external_requesters/#{requester.id}", params: update_params,
                                                                           headers: credentials

      requester.reload

      expect(JSON.parse(response.body)).to include(
        {
          'id' => requester.id,
          'name' => requester.name,
          'email' => requester.email,
          'cpf_cnpj' => requester.cpf_cnpj,
          'birth_date' => requester.birth_date.to_s,
          'phone' => requester.phone,
          'optional_email' => requester.optional_email,
          'optional_phone' => requester.optional_phone,
          'occupation' => requester.occupation,
          'notification' => requester.notification,
          'status' => requester.status,
          'prn' => requester.prn,
          'organization_id' => requester.organization_id,
          'changed_password' => requester.changed_password,
          'created_at' => requester.created_at.iso8601(3),
          'updated_at' => requester.updated_at.iso8601(3),
          'blocked' => requester.blocked,
          'address' => {
            'id' => requester.address.id,
            'number' => requester.address.number,
            'city' => requester.address.city,
            'complement' => requester.address.complement,
            'neighborhood' => requester.address.neighborhood,
            'postal_code' => requester.address.postal_code,
            'state' => requester.address.state,
            'street' => requester.address.street,
            'created_at' => requester.address.created_at.iso8601(3),
            'updated_at' => requester.address.updated_at.iso8601(3)
          }
        }
      )
    end
  end

  describe 'v3/printer_flow/external/external_requesters/:id/update_password' do
    let(:params) do
      {
        current_password: "#{requester.password}",
        password: '12345678@Ab',
        password_confirmation: '12345678@Ab'
      }
    end
    it 'responds with status ok' do
      put "/v3/printer_flow/external/external_requesters/#{requester.id}/update_password", params: params,
                                                                                           headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'renders a JSON with external requester' do
      put "/v3/printer_flow/external/external_requesters/#{requester.id}/update_password", params: params,
                                                                                           headers: credentials

      requester.reload

      expect(JSON.parse(response.body)).to include(
        {
          'id' => requester.id,
          'name' => requester.name,
          'email' => requester.email,
          'cpf_cnpj' => requester.cpf_cnpj,
          'birth_date' => requester.birth_date.to_s,
          'phone' => requester.phone,
          'optional_email' => requester.optional_email,
          'optional_phone' => requester.optional_phone,
          'occupation' => requester.occupation,
          'notification' => requester.notification,
          'status' => requester.status,
          'prn' => requester.prn,
          'organization_id' => requester.organization_id,
          'changed_password' => requester.changed_password,
          'created_at' => requester.created_at.iso8601(3),
          'updated_at' => requester.updated_at.iso8601(3),
          'blocked' => requester.blocked,
          'address' => {
            'id' => requester.address.id,
            'number' => requester.address.number,
            'city' => requester.address.city,
            'complement' => requester.address.complement,
            'neighborhood' => requester.address.neighborhood,
            'postal_code' => requester.address.postal_code,
            'state' => requester.address.state,
            'street' => requester.address.street,
            'created_at' => requester.address.created_at.iso8601(3),
            'updated_at' => requester.address.updated_at.iso8601(3)
          }
        }
      )
    end
  end
end
