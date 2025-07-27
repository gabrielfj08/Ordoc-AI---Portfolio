require 'rails_helper'

RSpec.describe 'PrinterFlow::Procedure', type: :request do
  let!(:stub_env) { stub_const('ENV', 'EXTERNAL_USER_ID' => procedure.created_by_id) }
  let!(:procedure) do
    create(:printer_flow_procedure, :external, organization: requester.organization, requester: requester)
  end
  let(:requester) { create(:external_requester) }

  let(:credentials) do
    { 'Authorization' => "Bearer #{requester.token}",
      'X-Api-Subdomain' => requester.organization.subdomain }
  end

  describe 'GET /v3/printer_flow/external/procedures' do
    it 'responds with status ok' do
      get '/v3/printer_flow/external/procedures', headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'renders a JSON with all procedures' do
      get '/v3/printer_flow/external/procedures', headers: credentials

      expect(JSON.parse(response.body)).to include(
        'printer_flow/procedures' => [{
          'id' => procedure.id,
          'organization_id' => procedure.organization_id,
          'responsible_group_id' => procedure.responsible_group_id,
          'prn' => procedure.prn,
          'process_number' => procedure.process_number,
          'status' => procedure.status,
          'payload' => procedure.payload,
          'procedure_template_id' => procedure.procedure_template_id,
          'procedure_template_name' => procedure.procedure_template_name,
          'requester_id' => procedure.requester_id,
          'schema' => [],
          'created_at' => procedure.created_at.iso8601(3),
          'updated_at' => procedure.updated_at.iso8601(3),
          'created_by_id' => procedure.created_by_id
        }],
        'meta' => {
          'total' => 1
        }
      )
    end
  end

  describe 'GET /v3/printer_flow/external/procedures/:id' do
    it 'responds with status ok' do
      get "/v3/printer_flow/external/procedures/#{procedure.id}",
          headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'renders a JSON with the procedure' do
      get "/v3/printer_flow/external/procedures/#{procedure.id}",
          headers: credentials

      expect(JSON.parse(response.body)).to include(
        {
          'id' => procedure.id,
          'organization_id' => procedure.organization_id,
          'responsible_group_id' => procedure.responsible_group_id,
          'prn' => procedure.prn,
          'process_number' => procedure.process_number,
          'status' => procedure.status,
          'payload' => procedure.payload,
          'procedure_template_id' => procedure.procedure_template_id,
          'procedure_template_name' => procedure.procedure_template_name,
          'requester_id' => procedure.requester_id,
          'schema' => [],
          'created_at' => procedure.created_at.iso8601(3),
          'updated_at' => procedure.updated_at.iso8601(3),
          'created_by_id' => procedure.created_by_id,
          'parent_procedure_template_name' => procedure.procedure_template.parent_procedure_template.name,
          'responsible_group' => {
            'code' => procedure.responsible_group.code,
            'id' => procedure.responsible_group.id,
            'name' => procedure.responsible_group.name,
            'parent_group_id' => procedure.responsible_group.parent_group_id,
            'prn' => procedure.responsible_group.prn,
            'status' => procedure.responsible_group.status,
            'created_at' => procedure.responsible_group.created_at.iso8601(3),
            'updated_at' => procedure.responsible_group.updated_at.iso8601(3)
          },
          'requester' => {
            'id' => procedure.requester.id,
            'birth_date' => procedure.requester.birth_date.to_s,
            'cpf_cnpj' => procedure.requester.cpf_cnpj,
            'email' => procedure.requester.email,
            'name' => procedure.requester.name,
            'occupation' => procedure.requester.occupation,
            'notification' => procedure.requester.notification,
            'optional_email' => procedure.requester.optional_email,
            'optional_phone' => procedure.requester.optional_phone,
            'organization_id' => procedure.requester.organization_id,
            'changed_password' => procedure.requester.changed_password,
            'phone' => procedure.requester.phone,
            'prn' => procedure.requester.prn,
            'status' => procedure.requester.status,
            'blocked' => procedure.requester.blocked,
            'created_at' => procedure.requester.created_at.iso8601(3),
            'updated_at' => procedure.requester.updated_at.iso8601(3)
          }
        }
      )
    end
  end

  describe 'PUT /v3/printer_flow/external/procedures/:id' do
    let(:update_params) do
      {
        procedure: {
          payload: []
        }
      }
    end
    it 'responds with status ok' do
      put "/v3/printer_flow/external/procedures/#{procedure.id}", params: update_params,
                                                                  headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'renders a JSON with the updated procedure' do
      put "/v3/printer_flow/external/procedures/#{procedure.id}", params: update_params,
                                                                  headers: credentials

      procedure.reload

      expect(JSON.parse(response.body)).to include(
        {
          'id' => procedure.id,
          'organization_id' => procedure.organization_id,
          'responsible_group_id' => procedure.responsible_group_id,
          'prn' => procedure.prn,
          'process_number' => procedure.process_number,
          'status' => procedure.status,
          'payload' => procedure.payload,
          'procedure_template_id' => procedure.procedure_template_id,
          'procedure_template_name' => procedure.procedure_template_name,
          'requester_id' => procedure.requester_id,
          'schema' => [],
          'created_at' => procedure.created_at.iso8601(3),
          'updated_at' => procedure.updated_at.iso8601(3),
          'created_by_id' => procedure.created_by_id,
          'parent_procedure_template_name' => procedure.procedure_template.parent_procedure_template.name,
          'responsible_group' => {
            'code' => procedure.responsible_group.code,
            'id' => procedure.responsible_group.id,
            'name' => procedure.responsible_group.name,
            'parent_group_id' => procedure.responsible_group.parent_group_id,
            'prn' => procedure.responsible_group.prn,
            'status' => procedure.responsible_group.status,
            'created_at' => procedure.responsible_group.created_at.iso8601(3),
            'updated_at' => procedure.responsible_group.updated_at.iso8601(3)
          },
          'requester' => {
            'id' => procedure.requester.id,
            'birth_date' => procedure.requester.birth_date.to_s,
            'cpf_cnpj' => procedure.requester.cpf_cnpj,
            'email' => procedure.requester.email,
            'name' => procedure.requester.name,
            'occupation' => procedure.requester.occupation,
            'notification' => procedure.requester.notification,
            'optional_email' => procedure.requester.optional_email,
            'optional_phone' => procedure.requester.optional_phone,
            'organization_id' => procedure.requester.organization_id,
            'changed_password' => procedure.requester.changed_password,
            'phone' => procedure.requester.phone,
            'prn' => procedure.requester.prn,
            'status' => procedure.requester.status,
            'blocked' => procedure.requester.blocked,
            'created_at' => procedure.requester.created_at.iso8601(3),
            'updated_at' => procedure.requester.updated_at.iso8601(3)
          }
        }
      )
    end
  end

  describe 'POST /v3/printer_flow/external/procedures' do
    let(:procedure_template) do
      create(:printer_flow_procedure_template, :child_template, organization: requester.organization)
    end
    let(:create_params) do
      {
        procedure: {
          procedure_template_id: procedure_template.id
        }
      }
    end

    it 'responds with status ok' do
      post '/v3/printer_flow/external/procedures', params: create_params,
                                                   headers: credentials

      expect(response).to have_http_status(:created)
    end

    it 'renders a JSON with the created procedure' do
      post '/v3/printer_flow/external/procedures', params: create_params,
                                                   headers: credentials

      procedure_id = JSON.parse(response.body)['id']
      procedure = PrinterFlow::Procedure.find(procedure_id)

      expect(JSON.parse(response.body)).to include(
        {
          'id' => procedure.id,
          'organization_id' => procedure.organization_id,
          'responsible_group_id' => procedure.responsible_group_id,
          'prn' => procedure.prn,
          'process_number' => procedure.process_number,
          'status' => procedure.status,
          'payload' => procedure.payload,
          'procedure_template_id' => procedure.procedure_template_id,
          'procedure_template_name' => procedure.procedure_template_name,
          'requester_id' => procedure.requester_id,
          'schema' => [],
          'created_at' => procedure.created_at.iso8601(3),
          'updated_at' => procedure.updated_at.iso8601(3),
          'created_by_id' => procedure.created_by_id,
          'parent_procedure_template_name' => procedure.procedure_template.parent_procedure_template.name,
          'responsible_group' => {
            'code' => procedure.responsible_group.code,
            'id' => procedure.responsible_group.id,
            'name' => procedure.responsible_group.name,
            'parent_group_id' => procedure.responsible_group.parent_group_id,
            'prn' => procedure.responsible_group.prn,
            'status' => procedure.responsible_group.status,
            'created_at' => procedure.responsible_group.created_at.iso8601(3),
            'updated_at' => procedure.responsible_group.updated_at.iso8601(3)
          },
          'requester' => {
            'id' => procedure.requester.id,
            'birth_date' => procedure.requester.birth_date.to_s,
            'cpf_cnpj' => procedure.requester.cpf_cnpj,
            'email' => procedure.requester.email,
            'name' => procedure.requester.name,
            'occupation' => procedure.requester.occupation,
            'notification' => procedure.requester.notification,
            'optional_email' => procedure.requester.optional_email,
            'optional_phone' => procedure.requester.optional_phone,
            'organization_id' => procedure.requester.organization_id,
            'changed_password' => procedure.requester.changed_password,
            'phone' => procedure.requester.phone,
            'prn' => procedure.requester.prn,
            'status' => procedure.requester.status,
            'blocked' => procedure.requester.blocked,
            'created_at' => procedure.requester.created_at.iso8601(3),
            'updated_at' => procedure.requester.updated_at.iso8601(3)
          }
        }
      )
    end
  end

  describe 'PUT /v3/printer_flow/external/procedures/:procedure_id/run' do
    it 'responds with status ok' do
      put "/v3/printer_flow/external/procedures/#{procedure.id}/run", headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'renders a JSON with the runned procedure' do
      put "/v3/printer_flow/external/procedures/#{procedure.id}/run", headers: credentials

      procedure.reload

      expect(JSON.parse(response.body)).to include(
        {
          'id' => procedure.id,
          'organization_id' => procedure.organization_id,
          'responsible_group_id' => procedure.responsible_group_id,
          'prn' => procedure.prn,
          'process_number' => procedure.process_number,
          'status' => procedure.status,
          'payload' => procedure.payload,
          'procedure_template_id' => procedure.procedure_template_id,
          'procedure_template_name' => procedure.procedure_template_name,
          'requester_id' => procedure.requester_id,
          'schema' => [],
          'created_at' => procedure.created_at.iso8601(3),
          'updated_at' => procedure.updated_at.iso8601(3),
          'created_by_id' => procedure.created_by_id,
          'parent_procedure_template_name' => procedure.procedure_template.parent_procedure_template.name,
          'responsible_group' => {
            'code' => procedure.responsible_group.code,
            'id' => procedure.responsible_group.id,
            'name' => procedure.responsible_group.name,
            'parent_group_id' => procedure.responsible_group.parent_group_id,
            'prn' => procedure.responsible_group.prn,
            'status' => procedure.responsible_group.status,
            'created_at' => procedure.responsible_group.created_at.iso8601(3),
            'updated_at' => procedure.responsible_group.updated_at.iso8601(3)
          },
          'requester' => {
            'id' => procedure.requester.id,
            'birth_date' => procedure.requester.birth_date.to_s,
            'cpf_cnpj' => procedure.requester.cpf_cnpj,
            'email' => procedure.requester.email,
            'name' => procedure.requester.name,
            'occupation' => procedure.requester.occupation,
            'notification' => procedure.requester.notification,
            'optional_email' => procedure.requester.optional_email,
            'optional_phone' => procedure.requester.optional_phone,
            'organization_id' => procedure.requester.organization_id,
            'changed_password' => procedure.requester.changed_password,
            'phone' => procedure.requester.phone,
            'prn' => procedure.requester.prn,
            'status' => procedure.requester.status,
            'blocked' => procedure.requester.blocked,
            'created_at' => procedure.requester.created_at.iso8601(3),
            'updated_at' => procedure.requester.updated_at.iso8601(3)
          }
        }
      )
    end
  end

  describe 'POST /v3/printer_flow/external/procedures/:procedure_id/request_to_finish' do
    let(:procedure) do
      create(:printer_flow_procedure, :external, :started, organization: requester.organization, requester: requester)
    end
    let(:params) do
      {
        description: 'Please, close the procedure.'
      }
    end

    it 'responds with status ok' do
      post "/v3/printer_flow/external/procedures/#{procedure.id}/request_to_finish", params: params,
                                                                                     headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'renders a JSON with the requeste to finish the procedure' do
      post "/v3/printer_flow/external/procedures/#{procedure.id}/request_to_finish", params: params,
                                                                                     headers: credentials

      procedure.reload

      expect(JSON.parse(response.body)).to include(
        {
          'id' => procedure.id,
          'organization_id' => procedure.organization_id,
          'responsible_group_id' => procedure.responsible_group_id,
          'prn' => procedure.prn,
          'process_number' => procedure.process_number,
          'status' => procedure.status,
          'payload' => procedure.payload,
          'procedure_template_id' => procedure.procedure_template_id,
          'procedure_template_name' => procedure.procedure_template_name,
          'requester_id' => procedure.requester_id,
          'schema' => [],
          'created_at' => procedure.created_at.iso8601(3),
          'updated_at' => procedure.updated_at.iso8601(3),
          'created_by_id' => procedure.created_by_id,
          'responsible_group' => {
            'code' => procedure.responsible_group.code,
            'id' => procedure.responsible_group.id,
            'name' => procedure.responsible_group.name,
            'parent_group_id' => procedure.responsible_group.parent_group_id,
            'prn' => procedure.responsible_group.prn,
            'status' => procedure.responsible_group.status,
            'created_at' => procedure.responsible_group.created_at.iso8601(3),
            'updated_at' => procedure.responsible_group.updated_at.iso8601(3)
          },
          'requester' => {
            'birth_date' => procedure.requester.birth_date.to_s,
            'cpf_cnpj' => procedure.requester.cpf_cnpj,
            'email' => procedure.requester.email,
            'id' => procedure.requester.id,
            'name' => procedure.requester.name,
            'changed_password' => procedure.requester.changed_password,
            'notification' => procedure.requester.notification,
            'occupation' => procedure.requester.occupation,
            'optional_email' => procedure.requester.optional_email,
            'optional_phone' => procedure.requester.optional_phone,
            'organization_id' => procedure.requester.organization_id,
            'phone' => procedure.requester.phone,
            'prn' => procedure.requester.prn,
            'status' => procedure.requester.status,
            'blocked' => procedure.requester.blocked,
            'created_at' => procedure.requester.created_at.iso8601(3),
            'updated_at' => procedure.requester.updated_at.iso8601(3)
          }
        }
      )
    end
  end
end
