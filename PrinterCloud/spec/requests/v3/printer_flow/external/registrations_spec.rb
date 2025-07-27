require 'rails_helper'

RSpec.describe 'PrinterFlow::ExternalRequester', type: :request do
  let(:requester) { create(:external_requester) }

  let(:credentials) do
    { 'X-Api-Subdomain' => requester.organization.subdomain }
  end

  describe 'v3/printer_flow/external/requesters' do
    let(:params) do
      {
        registration: {
          name: 'Usuário Externo',
          email: Faker::Internet.email,
          cpf_cnpj: CPF.generate,
          birth_date: '1993-10-12',
          phone: Faker::PhoneNumber.subscriber_number(length: 11),
          notification: 'email'
        },
        address: {
          street: 'Rua Desembargador Arthur Leme',
          number: '1000',
          complement: '6',
          postal_code: '80050-200',
          city: 'Curitiba',
          state: 'Paraná',
          neighborhood: 'Bacacheri'
        }
      }
    end

    it 'responds with status created' do
      post '/v3/printer_flow/external/requesters', params: params, headers: credentials

      expect(response).to have_http_status(:created)
    end

    it 'renders a JSON with external requester' do
      post '/v3/printer_flow/external/requesters', params: params, headers: credentials

      requester_id = JSON.parse(response.body)['id']
      requester = ::PrinterFlow::ExternalRequester.find(requester_id)

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
          'address' => {
            'id' => requester.address.id,
            'street' => requester.address.street,
            'number' => requester.address.number,
            'complement' => requester.address.complement,
            'postal_code' => requester.address.postal_code,
            'city' => requester.address.city,
            'state' => requester.address.state,
            'neighborhood' => requester.address.neighborhood,
            'created_at' => requester.address.created_at.iso8601(3),
            'updated_at' => requester.address.updated_at.iso8601(3)
          }
        }
      )
    end
  end
end
