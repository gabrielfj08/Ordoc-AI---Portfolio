require 'rails_helper'

RSpec.describe 'PrinterFlow::ExternalRequester', type: :request do
  let(:requester) { create(:external_requester) }

  let(:credentials) do
    { 'X-Api-Subdomain' => requester.organization.subdomain }
  end

  describe 'v3/printer_flow/external/requesters/sign_in' do
    let(:params) do
      {
        cpf_cnpj: requester.cpf_cnpj,
        password: requester.password
      }
    end

    it 'responds with status ok' do
      post '/v3/printer_flow/external/requesters/sign_in', params: params, headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'renders a JSON with external requester' do
      post '/v3/printer_flow/external/requesters/sign_in', params: params, headers: credentials

      requester.reload

      expect(JSON.parse(response.body)).to include(
        {
          'requester' => {
            'organization_id' => requester.organization_id,
            'id' => requester.id,
            'name' => requester.name,
            'email' => requester.email,
            'cpf_cnpj' => requester.cpf_cnpj,
            'status' => requester.status,
            'prn' => requester.prn,
            'created_at' => requester.created_at.iso8601(3),
            'updated_at' => requester.updated_at.iso8601(3),
            'code' => requester.code,
            'parent_group_id' => requester.parent_group_id,
            'phone' => requester.phone,
            'optional_phone' => requester.optional_phone,
            'birth_date' => requester.birth_date.to_s,
            'optional_email' => requester.optional_email,
            'occupation' => requester.occupation,
            'changed_password' => requester.changed_password,
            'one_time_password' => requester.one_time_password,
            'one_time_password_sent_at' => requester.one_time_password_sent_at.iso8601(3),
            'notification' => requester.notification,
            'blocked' => requester.blocked
          },
          'token' => requester.token
        }
      )
    end
  end
end
