require 'rails_helper'

RSpec.describe 'PrinterFlow::External::Passwords', type: :request do
  let(:requester) { create(:external_requester, address: address) }
  let(:address) { create(:address) }

  let(:credentials) do
    { 'X-Api-Subdomain' => requester.organization.subdomain }
  end

  describe 'POST /v3/printer_flow/external/requesters/passwords' do
    let(:params) do
      {
        cpf_cnpj: requester.cpf_cnpj,
        notification: requester.notification
      }
    end

    it 'responds with status ok' do
      post '/v3/printer_flow/external/requesters/passwords', params: params, headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'renders a JSON with external requester' do
      post '/v3/printer_flow/external/requesters/passwords', params: params, headers: credentials

      expect(JSON.parse(response.body)).to include(
        { 'message' => "Por favor, verifique a caixa de mensagem de email (#{DataMask.mask_email(requester.email)})." }
      )
    end
  end

  describe 'PUT v3/printer_flow/external/requesters/passwords' do
    let(:params) do
      {
        one_time_password: requester.one_time_password,
        password: '12345678Ab!',
        password_confirmation: '12345678Ab!'
      }
    end

    it 'responds with status ok' do
      put '/v3/printer_flow/external/requesters/passwords', params: params, headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'renders a JSON with external requester' do
      put '/v3/printer_flow/external/requesters/passwords', params: params, headers: credentials

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
