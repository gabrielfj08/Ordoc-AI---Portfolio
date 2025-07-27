require 'rails_helper'

RSpec.describe 'PrinterFlow::External::SharedProcedure', type: :request do
  let!(:shared_procedure) { create(:shared_procedure, procedure: procedure, external_requester: requester) }
  let(:requester) { create(:external_requester) }
  let(:procedure) do
    create(:printer_flow_procedure, :external, organization: requester.organization, requester: requester)
  end

  let(:credentials) do
    { 'Authorization' => "Bearer #{requester.token}",
      'X-Api-Subdomain' => requester.organization.subdomain }
  end

  describe 'GET /v3/printer_flow/external/shared_procedures' do
    it 'responds with status ok' do
      get '/v3/printer_flow/external/shared_procedures', headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'renders a JSON with all shared procedures' do
      get '/v3/printer_flow/external/shared_procedures', headers: credentials

      expect(JSON.parse(response.body)).to include(
        'printer_flow/shared_procedures' => [{
          'id' => shared_procedure.id,
          'status' => shared_procedure.status,
          'external_requester_id' => shared_procedure.external_requester_id,
          'external_requester' => { 'id' => shared_procedure.external_requester.id,
                                    'name' => shared_procedure.external_requester.name,
                                    'email' => shared_procedure.external_requester.email,
                                    'cpf_cnpj' => shared_procedure.external_requester.cpf_cnpj,
                                    'birth_date' => shared_procedure.external_requester.birth_date.to_s,
                                    'phone' => shared_procedure.external_requester.phone,
                                    'optional_email' => shared_procedure.external_requester.optional_email,
                                    'optional_phone' => shared_procedure.external_requester.optional_phone,
                                    'occupation' => shared_procedure.external_requester.occupation,
                                    'notification' => shared_procedure.external_requester.notification,
                                    'status' => shared_procedure.external_requester.status,
                                    'prn' => shared_procedure.external_requester.prn,
                                    'organization_id' => shared_procedure.external_requester.organization_id,
                                    'changed_password' => shared_procedure.external_requester.changed_password,
                                    'created_at' => shared_procedure.external_requester.created_at.iso8601(3),
                                    'updated_at' => shared_procedure.external_requester.updated_at.iso8601(3),
                                    'blocked' => shared_procedure.external_requester.blocked },
          'procedure_id' => shared_procedure.procedure_id,
          'procedure' => { 'id' => shared_procedure.procedure.id,
                           'organization_id' => shared_procedure.procedure.organization_id,
                           'responsible_group_id' => shared_procedure.procedure.responsible_group_id,
                           'prn' => shared_procedure.procedure.prn,
                           'process_number' => shared_procedure.procedure.process_number,
                           'status' => shared_procedure.procedure.status,
                           'payload' => shared_procedure.procedure.payload,
                           'procedure_template_id' => shared_procedure.procedure.procedure_template_id,
                           'procedure_template_name' => shared_procedure.procedure.procedure_template_name,
                           'requester_id' => shared_procedure.procedure.requester_id,
                           'schema' => [],
                           'created_at' => shared_procedure.procedure.created_at.iso8601(3),
                           'updated_at' => shared_procedure.procedure.updated_at.iso8601(3),
                           'created_by_id' => shared_procedure.procedure.created_by_id },
          'created_by_id' => shared_procedure.created_by_id,
          'created_by' => { 'id' => shared_procedure.created_by.id,
                            'name' => shared_procedure.created_by.name,
                            'email' => shared_procedure.created_by.email,
                            'cpf_cnpj' => shared_procedure.created_by.cpf_cnpj,
                            'birth_date' => shared_procedure.created_by.birth_date.to_s,
                            'phone' => shared_procedure.created_by.phone,
                            'optional_email' => shared_procedure.created_by.optional_email,
                            'optional_phone' => shared_procedure.created_by.optional_phone,
                            'occupation' => shared_procedure.created_by.occupation,
                            'notification' => shared_procedure.created_by.notification,
                            'status' => shared_procedure.created_by.status,
                            'prn' => shared_procedure.created_by.prn,
                            'organization_id' => shared_procedure.created_by.organization_id,
                            'changed_password' => shared_procedure.created_by.changed_password,
                            'created_at' => shared_procedure.created_by.created_at.iso8601(3),
                            'updated_at' => shared_procedure.created_by.updated_at.iso8601(3),
                            'blocked' => shared_procedure.created_by.blocked },
          'created_at' => shared_procedure.created_at.iso8601(3),
          'updated_at' => shared_procedure.updated_at.iso8601(3)
        }],
        'meta' => {
          'total' => 1
        }
      )
    end
  end

  describe 'POST /v3/printer_flow/external/shared_procedures' do
    let(:second_requester) { create(:external_requester, organization: requester.organization) }
    let(:create_params) do
      {
        shared_procedure: {
          cpf_cnpj: second_requester.cpf_cnpj,
          procedure_id: procedure.id
        }
      }
    end
    it 'responds with status ok' do
      post '/v3/printer_flow/external/shared_procedures', params: create_params, headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'renders a JSON with a created shared procedure' do
      post '/v3/printer_flow/external/shared_procedures', params: create_params, headers: credentials

      shared_procedure_id = JSON.parse(response.body)['id']
      shared_procedure = ::PrinterFlow::External::SharedProcedure.find(shared_procedure_id)

      expect(JSON.parse(response.body)).to include(
        {
          'id' => shared_procedure.id,
          'status' => shared_procedure.status,
          'external_requester_id' => shared_procedure.external_requester_id,
          'procedure_id' => shared_procedure.procedure_id,
          'created_by_id' => shared_procedure.created_by_id,
          'created_at' => shared_procedure.created_at.iso8601(3),
          'updated_at' => shared_procedure.updated_at.iso8601(3)
        }
      )
    end
  end

  describe 'PUT /v3/printer_flow/external/shared_procedures/:shared_procedure_id/accept' do
    it 'responds with status ok' do
      put "/v3/printer_flow/external/shared_procedures/#{shared_procedure.id}/accept", headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'renders a JSON with a accepted shared procedure' do
      put "/v3/printer_flow/external/shared_procedures/#{shared_procedure.id}/accept", headers: credentials

      shared_procedure.reload

      expect(JSON.parse(response.body)).to include(
        {
          'id' => shared_procedure.id,
          'status' => shared_procedure.status,
          'external_requester_id' => shared_procedure.external_requester_id,
          'procedure_id' => shared_procedure.procedure_id,
          'created_by_id' => shared_procedure.created_by_id,
          'created_at' => shared_procedure.created_at.iso8601(3),
          'updated_at' => shared_procedure.updated_at.iso8601(3)
        }
      )
    end
  end

  describe 'PUT /v3/printer_flow/external/shared_procedures/:shared_procedure_id/refuse' do
    let(:refuse_params) do
      {
        note: 'tarefa esta incompleta'
      }
    end

    it 'responds with status ok' do
      put "/v3/printer_flow/external/shared_procedures/#{shared_procedure.id}/refuse", headers: credentials,
                                                                                       params: refuse_params

      expect(response).to have_http_status(:ok)
    end

    it 'renders a JSON with a refused shared procedure' do
      put "/v3/printer_flow/external/shared_procedures/#{shared_procedure.id}/refuse", headers: credentials,
                                                                                       params: refuse_params

      shared_procedure.reload

      expect(JSON.parse(response.body)).to include(
        {
          'id' => shared_procedure.id,
          'status' => shared_procedure.status,
          'external_requester_id' => shared_procedure.external_requester_id,
          'procedure_id' => shared_procedure.procedure_id,
          'created_by_id' => shared_procedure.created_by_id,
          'created_at' => shared_procedure.created_at.iso8601(3),
          'updated_at' => shared_procedure.updated_at.iso8601(3)
        }
      )
    end
  end

  describe 'DELETE /v3/printer_flow/external/shared_procedures/:id' do
    let(:shared_procedure) do
      create(:shared_procedure, procedure: procedure, created_by: requester)
    end
    it 'responds with status ok' do
      delete "/v3/printer_flow/external/shared_procedures/#{shared_procedure.id}", headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'renders a JSON with the deleted shared procedure' do
      delete "/v3/printer_flow/external/shared_procedures/#{shared_procedure.id}", headers: credentials

      expect(JSON.parse(response.body)).to include(
        {
          'id' => shared_procedure.id,
          'status' => shared_procedure.status,
          'external_requester_id' => shared_procedure.external_requester_id,
          'procedure_id' => shared_procedure.procedure_id,
          'created_by_id' => shared_procedure.created_by_id,
          'created_at' => shared_procedure.created_at.iso8601(3),
          'updated_at' => shared_procedure.updated_at.iso8601(3)
        }
      )
    end
  end
end
