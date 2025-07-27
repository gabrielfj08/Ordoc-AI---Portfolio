require 'rails_helper'

RSpec.describe 'PrinterFlow::Requester', type: :request do
  let!(:address) { create(:address, addressable: user.internal_requester) }
  let(:user) { create(:printer_cloud_user, :with_policies) }

  let(:credentials) do
    { 'Authorization' => "Bearer #{user.token}",
      'X-Api-Subdomain' => user.organization.subdomain }
  end

  describe 'GET /v3/printer_flow/requesters' do
    it 'responds with status ok' do
      get '/v3/printer_flow/requesters', headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'renders a JSON with all requesters' do
      get '/v3/printer_flow/requesters', headers: credentials

      expect(JSON.parse(response.body)).to include(
        'printer_flow/requesters' => [{
          'id' => user.internal_requester.id,
          'name' => user.internal_requester.name,
          'organization_id' => user.internal_requester.organization_id,
          'parent_group_id' => nil,
          'prn' => user.internal_requester.prn,
          'email' => user.internal_requester.email,
          'type' => user.internal_requester.type,
          'cpf_cnpj' => user.internal_requester.cpf_cnpj,
          'code' => user.internal_requester.code,
          'status' => user.internal_requester.status,
          'blocked' => user.internal_requester.blocked,
          'birth_date' => user.internal_requester.birth_date.strftime('%Y-%m-%d'),
          'phone' => user.internal_requester.phone,
          'optional_email' => user.internal_requester.optional_email,
          'optional_phone' => user.internal_requester.optional_phone,
          'occupation' => user.internal_requester.occupation,
          'created_at' => user.internal_requester.created_at.iso8601(3),
          'updated_at' => user.internal_requester.updated_at.iso8601(3)
        }],
        'meta' => {
          'total' => 1
        }
      )
    end
  end

  describe 'GET /v3/printer_flow/requesters/:requester_id' do
    it 'responds with status ok' do
      get "/v3/printer_flow/requesters/#{user.internal_requester.id}", headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'renders a JSON with the requester' do
      get "/v3/printer_flow/requesters/#{user.internal_requester.id}", headers: credentials

      expect(JSON.parse(response.body)).to include(
        'id' => user.internal_requester.id,
        'name' => user.internal_requester.name,
        'occupation' => user.internal_requester.occupation,
        'optional_email' => user.internal_requester.optional_email,
        'optional_phone' => user.internal_requester.optional_phone,
        'organization_id' => user.internal_requester.organization_id,
        'parent_group_id' => nil,
        'phone' => user.internal_requester.phone,
        'prn' => user.internal_requester.prn,
        'email' => user.internal_requester.email,
        'type' => user.internal_requester.type,
        'cpf_cnpj' => user.internal_requester.cpf_cnpj,
        'birth_date' => user.internal_requester.birth_date.strftime('%Y-%m-%d'),
        'code' => user.internal_requester.code,
        'status' => user.internal_requester.status,
        'created_at' => user.internal_requester.created_at.iso8601(3),
        'updated_at' => user.internal_requester.updated_at.iso8601(3),
        'user' => { 'avatar_url' => user.internal_requester.user.avatar_url,
                    'changed_password' => user.internal_requester.user.changed_password,
                    'cpf' => user.internal_requester.user.cpf,
                    'created_at' => user.internal_requester.user.created_at.iso8601(3),
                    'updated_at' => user.internal_requester.user.updated_at.iso8601(3),
                    'deleted_at' => nil,
                    'date_of_birth' => user.internal_requester.user.date_of_birth.strftime('%Y-%m-%d'),
                    'email' => user.internal_requester.user.email,
                    'id' => user.internal_requester.user.id,
                    'name' => user.internal_requester.user.name,
                    'organization_id' => user.internal_requester.user.organization_id,
                    'phone' => user.internal_requester.user.phone,
                    'prn' => user.internal_requester.user.prn,
                    'status' => user.internal_requester.user.status,
                    'username' => user.internal_requester.user.username,
                    'registration_number' => nil },
        'address' => {
          'id' => user.internal_requester.address.id,
          'number' => user.internal_requester.address.number,
          'city' => user.internal_requester.address.city,
          'complement' => user.internal_requester.address.complement,
          'neighborhood' => user.internal_requester.address.neighborhood,
          'postal_code' => user.internal_requester.address.postal_code,
          'state' => user.internal_requester.address.state,
          'street' => user.internal_requester.address.street,
          'created_at' => user.internal_requester.address.created_at.iso8601(3),
          'updated_at' => user.internal_requester.address.updated_at.iso8601(3),
          'deleted_at' => nil
        },
        'justification_notes' => []
      )
    end
  end

  describe 'PUT /v3/printer_flow/requesters/:requester_id/deactivate' do
    let(:params) do
      { note: 'Desativado por inatividade' }
    end

    it 'responds with status ok' do
      put "/v3/printer_flow/requesters/#{user.internal_requester.id}/deactivate", params: params, headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'renders a JSON response with the inactive requester' do
      put "/v3/printer_flow/requesters/#{user.internal_requester.id}/deactivate", params: params, headers: credentials

      user.internal_requester.reload

      expect(JSON.parse(response.body)).to include(
        'id' => user.internal_requester.id,
        'name' => user.internal_requester.name,
        'occupation' => nil,
        'optional_email' => nil,
        'optional_phone' => nil,
        'organization_id' => user.internal_requester.organization_id,
        'parent_group_id' => nil,
        'phone' => user.internal_requester.phone,
        'prn' => user.internal_requester.prn,
        'email' => user.internal_requester.email,
        'type' => user.internal_requester.type,
        'cpf_cnpj' => user.internal_requester.cpf_cnpj,
        'birth_date' => user.internal_requester.birth_date.strftime('%Y-%m-%d'),
        'code' => user.internal_requester.code,
        'status' => user.internal_requester.status,
        'created_at' => user.internal_requester.created_at.iso8601(3),
        'updated_at' => user.internal_requester.updated_at.iso8601(3),
        'user' => { 'avatar_url' => user.internal_requester.user.avatar_url,
                    'changed_password' => user.internal_requester.user.changed_password,
                    'cpf' => user.internal_requester.user.cpf,
                    'created_at' => user.internal_requester.user.created_at.iso8601(3),
                    'updated_at' => user.internal_requester.user.updated_at.iso8601(3),
                    'deleted_at' => nil,
                    'date_of_birth' => user.internal_requester.user.date_of_birth.to_s,
                    'email' => user.internal_requester.user.email,
                    'id' => user.internal_requester.user.id,
                    'name' => user.internal_requester.user.name,
                    'organization_id' => user.internal_requester.user.organization_id,
                    'phone' => user.internal_requester.user.phone,
                    'prn' => user.internal_requester.user.prn,
                    'status' => user.internal_requester.user.status,
                    'username' => user.internal_requester.user.username,
                    'registration_number' => nil },
        'address' => {
          'id' => user.internal_requester.address.id,
          'number' => user.internal_requester.address.number,
          'city' => user.internal_requester.address.city,
          'complement' => user.internal_requester.address.complement,
          'neighborhood' => user.internal_requester.address.neighborhood,
          'postal_code' => user.internal_requester.address.postal_code,
          'state' => user.internal_requester.address.state,
          'street' => user.internal_requester.address.street,
          'created_at' => user.internal_requester.address.created_at.iso8601(3),
          'updated_at' => user.internal_requester.address.updated_at.iso8601(3),
          'deleted_at' => nil
        },
        'justification_notes' => [{
          'id' => user.internal_requester.justification_notes.first.id,
          'action' => user.internal_requester.justification_notes.first.action,
          'created_at' => user.internal_requester.justification_notes.first.created_at.iso8601(3),
          'updated_at' => user.internal_requester.justification_notes.first.updated_at.iso8601(3),
          'created_by_id' => user.internal_requester.justification_notes.first.created_by_id,
          'justifiable_id' => user.internal_requester.justification_notes.first.justifiable_id,
          'justifiable_type' => user.internal_requester.justification_notes.first.justifiable_type,
          'note' => user.internal_requester.justification_notes.first.note
        }]
      )
    end
  end

  describe 'PUT /v3/printer_flow/requesters/:requester_id/activate' do
    let(:requester) { create(:external_requester, :inactive, organization: user.organization) }

    it 'responds with status ok' do
      put "/v3/printer_flow/requesters/#{requester.id}/activate", headers: credentials
      expect(response).to have_http_status(:ok)
    end

    it 'renders a JSON response with the active requester' do
      put "/v3/printer_flow/requesters/#{requester.id}/activate", headers: credentials

      requester.reload
      expect(JSON.parse(response.body)).to include(
        'id' => requester.id,
        'name' => requester.name,
        'organization_id' => requester.organization_id,
        'parent_group_id' => nil,
        'prn' => requester.prn,
        'email' => requester.email,
        'type' => requester.type,
        'cpf_cnpj' => requester.cpf_cnpj,
        'birth_date' => requester.birth_date.to_s,
        'code' => requester.code,
        'status' => requester.status,
        'created_at' => requester.created_at.iso8601(3),
        'updated_at' => requester.updated_at.iso8601(3),
        'user' => nil,
        'phone' => requester.phone,
        'optional_email' => requester.optional_email,
        'optional_phone' => requester.optional_phone,
        'occupation' => requester.occupation,
        'justification_notes' => [],
        'address' => nil
      )
    end
  end

  describe 'PUT /v3/printer_flow/requesters/:requester_id' do
    let(:update_params) do
      { name: 'Fabiana Ramos',
        cpf_cnpj: '11404702997',
        phone: '41987257638',
        email: 'fabianavitoriaramos@gmail.com',
        birth_date: '09/04/1998',
        optional_phone: nil,
        optional_email: 'fabiana.ramos@printerdobrasil.com.br',
        occupation: 'Desenvolvedora',
        address: {
          street: 'Rua Ubaldino do Amaral',
          number: 327,
          complement: '120',
          postal_code: '80060195',
          city: 'Curitiba',
          state: 'Paraná',
          neighborhood: 'Bacacheri'
        } }
    end
    it 'responds with status ok' do
      put "/v3/printer_flow/requesters/#{user.internal_requester.id}", params: update_params, headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'renders a JSON response with the updated requester' do
      put "/v3/printer_flow/requesters/#{user.internal_requester.id}", params: update_params, headers: credentials

      user.internal_requester.reload
      expect(JSON.parse(response.body)).to include(
        'id' => user.internal_requester.id,
        'name' => user.internal_requester.name,
        'organization_id' => user.internal_requester.organization_id,
        'parent_group_id' => nil,
        'prn' => user.internal_requester.prn,
        'email' => user.internal_requester.email,
        'type' => user.internal_requester.type,
        'cpf_cnpj' => user.internal_requester.cpf_cnpj,
        'birth_date' => user.internal_requester.birth_date.strftime('%Y-%m-%d'),
        'code' => user.internal_requester.code,
        'status' => user.internal_requester.status,
        'created_at' => user.internal_requester.created_at.iso8601(3),
        'updated_at' => user.internal_requester.updated_at.iso8601(3),
        'user' => { 'avatar_url' => user.internal_requester.user.avatar_url,
                    'changed_password' => user.internal_requester.user.changed_password,
                    'cpf' => user.internal_requester.user.cpf,
                    'created_at' => user.internal_requester.user.created_at.iso8601(3),
                    'updated_at' => user.internal_requester.user.updated_at.iso8601(3),
                    'deleted_at' => nil,
                    'date_of_birth' => user.internal_requester.user.date_of_birth.to_s,
                    'email' => user.internal_requester.user.email,
                    'id' => user.internal_requester.user.id,
                    'name' => user.internal_requester.user.name,
                    'organization_id' => user.internal_requester.user.organization_id,
                    'phone' => user.internal_requester.user.phone,
                    'prn' => user.internal_requester.user.prn,
                    'status' => user.internal_requester.user.status,
                    'username' => user.internal_requester.user.username,
                    'registration_number' => nil },
        'phone' => user.internal_requester.phone,
        'optional_email' => user.internal_requester.optional_email,
        'optional_phone' => user.internal_requester.optional_phone,
        'occupation' => user.internal_requester.occupation,
        'justification_notes' => [],
        'address' => {
          'id' => user.internal_requester.address.id,
          'number' => user.internal_requester.address.number,
          'city' => user.internal_requester.address.city,
          'complement' => user.internal_requester.address.complement,
          'neighborhood' => user.internal_requester.address.neighborhood,
          'postal_code' => user.internal_requester.address.postal_code,
          'state' => user.internal_requester.address.state,
          'street' => user.internal_requester.address.street,
          'created_at' => user.internal_requester.address.created_at.iso8601(3),
          'updated_at' => user.internal_requester.address.updated_at.iso8601(3),
          'deleted_at' => nil
        }
      )
    end
  end
end
