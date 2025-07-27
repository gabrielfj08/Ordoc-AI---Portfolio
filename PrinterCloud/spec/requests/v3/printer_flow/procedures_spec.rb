require 'rails_helper'

RSpec.describe 'PrinterFlow::Procedure', type: :request do
  let!(:procedure) { create(:printer_flow_procedure, :internal, responsible_group: group_requester, created_by: user) }
  let(:user) { create(:printer_cloud_user) }
  let(:group_requester) { create(:group_requester, organization: user.organization) }

  let(:credentials) do
    { 'Authorization' => "Bearer #{user.token}",
      'X-Api-Subdomain' => user.organization.subdomain }
  end

  describe 'GET /v3/printer_flow/procedures' do
    it 'responds with status ok' do
      get '/v3/printer_flow/procedures', headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'renders a JSON with all procedures' do
      get '/v3/printer_flow/procedures', headers: credentials

      expect(JSON.parse(response.body)).to include(
        'printer_flow/procedures' => [{
          'id' => procedure.id,
          'organization_id' => procedure.organization_id,
          'responsible_group_id' => procedure.responsible_group_id,
          'prn' => procedure.prn,
          'process_number' => procedure.process_number,
          'deadline' => procedure.deadline.to_s,
          'status' => procedure.status,
          'source' => procedure.source,
          'private' => procedure.private,
          'priority' => procedure.priority,
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

  describe 'GET /v3/printer_flow/group_requesters/:group_requester_id/procedures/:id' do
    it 'responds with status ok' do
      get "/v3/printer_flow/group_requesters/#{group_requester.id}/procedures/#{procedure.id}", headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'renders a JSON with the procedure' do
      get "/v3/printer_flow/group_requesters/#{group_requester.id}/procedures/#{procedure.id}", headers: credentials

      expect(JSON.parse(response.body)).to include(
        {
          'id' => procedure.id,
          'organization_id' => procedure.organization_id,
          'responsible_group_id' => procedure.responsible_group_id,
          'prn' => procedure.prn,
          'process_number' => procedure.process_number,
          'deadline' => procedure.deadline.to_s,
          'status' => procedure.status,
          'source' => procedure.source,
          'private' => procedure.private,
          'priority' => procedure.priority,
          'payload' => procedure.payload,
          'procedure_template_id' => procedure.procedure_template_id,
          'procedure_template_name' => procedure.procedure_template_name,
          'parent_procedure_template_name' => procedure.procedure_template.parent_procedure_template.name,
          'requester_id' => procedure.requester_id,
          'schema' => procedure.schema,
          'created_at' => procedure.created_at.iso8601(3),
          'updated_at' => procedure.updated_at.iso8601(3),
          'created_by_id' => procedure.created_by_id,
          'created_by' => {
            'avatar_url' => user.avatar_url,
            'changed_password' => false,
            'cpf' => user.cpf,
            'created_at' => user.created_at.iso8601(3),
            'date_of_birth' => user.date_of_birth.to_s,
            'deleted_at' => user.deleted_at,
            'email' => user.email,
            'id' => user.id,
            'name' => user.name,
            'organization_id' => user.organization_id,
            'phone' => user.phone,
            'prn' => user.prn,
            'registration_number' => nil,
            'status' => user.status,
            'updated_at' => user.created_at.iso8601(3),
            'username' => user.username
          },
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
            'code' => procedure.requester.code,
            'birth_date' => procedure.requester.birth_date,
            'cpf_cnpj' => procedure.requester.cpf_cnpj,
            'email' => procedure.requester.email,
            'id' => procedure.requester.id,
            'name' => procedure.requester.name,
            'occupation' => procedure.requester.occupation,
            'optional_email' => procedure.requester.optional_email,
            'optional_phone' => procedure.requester.optional_phone,
            'organization_id' => procedure.requester.organization_id,
            'parent_group_id' => procedure.requester.parent_group_id,
            'phone' => procedure.requester.phone,
            'prn' => procedure.requester.prn,
            'status' => procedure.requester.status,
            'type' => procedure.requester.type,
            'created_at' => procedure.requester.created_at.iso8601(3),
            'updated_at' => procedure.requester.updated_at.iso8601(3),
            'blocked' => procedure.requester.blocked
          }
        }
      )
    end
  end

  describe 'PUT /v3/printer_flow/group_requesters/:group_requester_id/procedures/:id' do
    let(:update_params) do
      {
        procedure: {
          status: :running,
          source: :internal,
          priority: :normal,
          deadline: '25/10/2030'
        }
      }
    end
    it 'responds with status ok' do
      put "/v3/printer_flow/group_requesters/#{group_requester.id}/procedures/#{procedure.id}", params: update_params,
                                                                                                headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'renders a JSON with the updated procedure' do
      put "/v3/printer_flow/group_requesters/#{group_requester.id}/procedures/#{procedure.id}", params: update_params,
                                                                                                headers: credentials

      procedure.reload

      expect(JSON.parse(response.body)).to include(
        {
          'id' => procedure.id,
          'organization_id' => procedure.organization_id,
          'responsible_group_id' => procedure.responsible_group_id,
          'prn' => procedure.prn,
          'process_number' => procedure.process_number,
          'deadline' => procedure.deadline.to_s,
          'status' => procedure.status,
          'source' => procedure.source,
          'private' => procedure.private,
          'priority' => procedure.priority,
          'payload' => procedure.payload,
          'procedure_template_id' => procedure.procedure_template_id,
          'procedure_template_name' => procedure.procedure_template_name,
          'parent_procedure_template_name' => procedure.procedure_template.parent_procedure_template.name,
          'requester_id' => procedure.requester_id,
          'schema' => procedure.schema,
          'created_at' => procedure.created_at.iso8601(3),
          'updated_at' => procedure.updated_at.iso8601(3),
          'created_by_id' => procedure.created_by_id,
          'created_by' => {
            'avatar_url' => user.avatar_url,
            'changed_password' => false,
            'cpf' => user.cpf,
            'created_at' => user.created_at.iso8601(3),
            'date_of_birth' => user.date_of_birth.to_s,
            'deleted_at' => user.deleted_at,
            'email' => user.email,
            'id' => user.id,
            'name' => user.name,
            'organization_id' => user.organization_id,
            'phone' => user.phone,
            'prn' => user.prn,
            'registration_number' => nil,
            'status' => user.status,
            'updated_at' => user.created_at.iso8601(3),
            'username' => user.username
          },
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
            'code' => procedure.requester.code,
            'birth_date' => procedure.requester.birth_date,
            'cpf_cnpj' => procedure.requester.cpf_cnpj,
            'email' => procedure.requester.email,
            'id' => procedure.requester.id,
            'name' => procedure.requester.name,
            'occupation' => procedure.requester.occupation,
            'optional_email' => procedure.requester.optional_email,
            'optional_phone' => procedure.requester.optional_phone,
            'organization_id' => procedure.requester.organization_id,
            'parent_group_id' => procedure.requester.parent_group_id,
            'phone' => procedure.requester.phone,
            'prn' => procedure.requester.prn,
            'status' => procedure.requester.status,
            'type' => procedure.requester.type,
            'created_at' => procedure.requester.created_at.iso8601(3),
            'updated_at' => procedure.requester.updated_at.iso8601(3),
            'blocked' => procedure.requester.blocked
          }
        }
      )
    end
  end

  describe 'POST /v3/printer_flow/group_requesters/:group_requester_id/procedures' do
    let!(:requester_assignment) { create(:requester_assignment, requester: group_requester, user: user) }
    let(:procedure_template) { create(:printer_flow_procedure_template, organization: user.organization) }
    let(:create_params) do
      {
        procedure: {
          procedure_template_id: procedure_template.id,
          source: :internal,
          private: true,
          requester_id: user.internal_requester.id,
          priority: :high,
          deadline: '25/10/2030'
        }
      }
    end
    it 'responds with status ok' do
      post "/v3/printer_flow/group_requesters/#{group_requester.id}/procedures", params: create_params,
                                                                                 headers: credentials

      expect(response).to have_http_status(:created)
    end

    it 'renders a JSON with the created procedure' do
      post "/v3/printer_flow/group_requesters/#{group_requester.id}/procedures", params: create_params,
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
          'deadline' => procedure.deadline.to_s,
          'status' => procedure.status,
          'source' => procedure.source,
          'private' => procedure.private,
          'priority' => procedure.priority,
          'payload' => procedure.payload,
          'procedure_template_id' => procedure.procedure_template_id,
          'procedure_template_name' => procedure.procedure_template_name,
          'parent_procedure_template_name' => nil,
          'requester_id' => procedure.requester_id,
          'schema' => procedure.schema,
          'created_at' => procedure.created_at.iso8601(3),
          'updated_at' => procedure.updated_at.iso8601(3),
          'created_by_id' => procedure.created_by_id,
          'created_by' => {
            'avatar_url' => procedure.created_by.avatar_url,
            'changed_password' => false,
            'cpf' => procedure.created_by.cpf,
            'created_at' => procedure.created_by.created_at.iso8601(3),
            'date_of_birth' => procedure.created_by.date_of_birth.to_s,
            'deleted_at' => procedure.created_by.deleted_at,
            'email' => procedure.created_by.email,
            'id' => procedure.created_by.id,
            'name' => procedure.created_by.name,
            'organization_id' => procedure.created_by.organization_id,
            'phone' => procedure.created_by.phone,
            'prn' => procedure.created_by.prn,
            'registration_number' => nil,
            'status' => procedure.created_by.status,
            'updated_at' => procedure.created_by.created_at.iso8601(3),
            'username' => procedure.created_by.username
          },
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
            'code' => procedure.requester.code,
            'birth_date' => procedure.requester.birth_date.to_s,
            'cpf_cnpj' => procedure.requester.cpf_cnpj,
            'email' => procedure.requester.email,
            'id' => procedure.requester.id,
            'name' => procedure.requester.name,
            'occupation' => procedure.requester.occupation,
            'optional_email' => procedure.requester.optional_email,
            'optional_phone' => procedure.requester.optional_phone,
            'organization_id' => procedure.requester.organization_id,
            'parent_group_id' => procedure.requester.parent_group_id,
            'phone' => procedure.requester.phone,
            'prn' => procedure.requester.prn,
            'status' => procedure.requester.status,
            'type' => procedure.requester.type,
            'created_at' => procedure.requester.created_at.iso8601(3),
            'updated_at' => procedure.requester.updated_at.iso8601(3),
            'blocked' => procedure.requester.blocked
          }
        }
      )
    end
  end

  describe 'PUT /v3/printer_flow/group_requesters/:group_requester_id/procedures/:procedure_id/archive' do
    let(:archive_params) do
      {
        note: 'Processo arquivado'
      }
    end
    it 'responds with status ok' do
      put "/v3/printer_flow/group_requesters/#{group_requester.id}/procedures/#{procedure.id}/archive", params: archive_params,
                                                                                                        headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'renders a JSON with the archived procedure' do
      put "/v3/printer_flow/group_requesters/#{group_requester.id}/procedures/#{procedure.id}/archive", params: archive_params,
                                                                                                        headers: credentials

      procedure.reload

      expect(JSON.parse(response.body)).to include(
        {
          'id' => procedure.id,
          'organization_id' => procedure.organization_id,
          'responsible_group_id' => procedure.responsible_group_id,
          'prn' => procedure.prn,
          'process_number' => procedure.process_number,
          'deadline' => procedure.deadline.to_s,
          'status' => procedure.status,
          'source' => procedure.source,
          'private' => procedure.private,
          'priority' => procedure.priority,
          'payload' => procedure.payload,
          'procedure_template_id' => procedure.procedure_template_id,
          'procedure_template_name' => procedure.procedure_template_name,
          'parent_procedure_template_name' => procedure.procedure_template.parent_procedure_template.name,
          'requester_id' => procedure.requester_id,
          'schema' => procedure.schema,
          'created_at' => procedure.created_at.iso8601(3),
          'updated_at' => procedure.updated_at.iso8601(3),
          'created_by_id' => procedure.created_by_id,
          'created_by' => {
            'avatar_url' => user.avatar_url,
            'changed_password' => false,
            'cpf' => user.cpf,
            'created_at' => user.created_at.iso8601(3),
            'date_of_birth' => user.date_of_birth.to_s,
            'deleted_at' => user.deleted_at,
            'email' => user.email,
            'id' => user.id,
            'name' => user.name,
            'organization_id' => user.organization_id,
            'phone' => user.phone,
            'prn' => user.prn,
            'registration_number' => nil,
            'status' => user.status,
            'updated_at' => user.created_at.iso8601(3),
            'username' => user.username
          },
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
            'code' => procedure.requester.code,
            'birth_date' => procedure.requester.birth_date,
            'cpf_cnpj' => procedure.requester.cpf_cnpj,
            'email' => procedure.requester.email,
            'id' => procedure.requester.id,
            'name' => procedure.requester.name,
            'occupation' => procedure.requester.occupation,
            'optional_email' => procedure.requester.optional_email,
            'optional_phone' => procedure.requester.optional_phone,
            'organization_id' => procedure.requester.organization_id,
            'parent_group_id' => procedure.requester.parent_group_id,
            'phone' => procedure.requester.phone,
            'prn' => procedure.requester.prn,
            'status' => procedure.requester.status,
            'type' => procedure.requester.type,
            'created_at' => procedure.requester.created_at.iso8601(3),
            'updated_at' => procedure.requester.updated_at.iso8601(3),
            'blocked' => procedure.requester.blocked
          }
        }
      )
    end
  end

  describe 'PUT /v3/printer_flow/group_requesters/:group_requester_id/procedures/:procedure_id/unarchive' do
    let(:procedure) do
      create(:printer_flow_procedure, :internal, :archived, responsible_group_id: group_requester.id, created_by: user)
    end
    let(:unarchive_params) do
      {
        note: 'Processo desarquivado'
      }
    end
    it 'responds with status ok' do
      put "/v3/printer_flow/group_requesters/#{group_requester.id}/procedures/#{procedure.id}/unarchive", params: unarchive_params,
                                                                                                          headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'renders a JSON with the archived procedure' do
      put "/v3/printer_flow/group_requesters/#{group_requester.id}/procedures/#{procedure.id}/unarchive", params: unarchive_params,
                                                                                                          headers: credentials

      procedure.reload

      expect(JSON.parse(response.body)).to include(
        {
          'id' => procedure.id,
          'organization_id' => procedure.organization_id,
          'responsible_group_id' => procedure.responsible_group_id,
          'prn' => procedure.prn,
          'process_number' => procedure.process_number,
          'deadline' => procedure.deadline.to_s,
          'status' => procedure.status,
          'source' => procedure.source,
          'private' => procedure.private,
          'priority' => procedure.priority,
          'payload' => procedure.payload,
          'procedure_template_id' => procedure.procedure_template_id,
          'procedure_template_name' => procedure.procedure_template_name,
          'parent_procedure_template_name' => procedure.procedure_template.parent_procedure_template.name,
          'requester_id' => procedure.requester_id,
          'schema' => procedure.schema,
          'created_at' => procedure.created_at.iso8601(3),
          'updated_at' => procedure.updated_at.iso8601(3),
          'created_by_id' => procedure.created_by_id,
          'created_by' => {
            'avatar_url' => user.avatar_url,
            'changed_password' => false,
            'cpf' => user.cpf,
            'created_at' => user.created_at.iso8601(3),
            'date_of_birth' => user.date_of_birth.to_s,
            'deleted_at' => user.deleted_at,
            'email' => user.email,
            'id' => user.id,
            'name' => user.name,
            'organization_id' => user.organization_id,
            'phone' => user.phone,
            'prn' => user.prn,
            'registration_number' => nil,
            'status' => user.status,
            'updated_at' => user.created_at.iso8601(3),
            'username' => user.username
          },
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
            'code' => procedure.requester.code,
            'birth_date' => procedure.requester.birth_date,
            'cpf_cnpj' => procedure.requester.cpf_cnpj,
            'email' => procedure.requester.email,
            'id' => procedure.requester.id,
            'name' => procedure.requester.name,
            'occupation' => procedure.requester.occupation,
            'optional_email' => procedure.requester.optional_email,
            'optional_phone' => procedure.requester.optional_phone,
            'organization_id' => procedure.requester.organization_id,
            'parent_group_id' => procedure.requester.parent_group_id,
            'phone' => procedure.requester.phone,
            'prn' => procedure.requester.prn,
            'status' => procedure.requester.status,
            'type' => procedure.requester.type,
            'created_at' => procedure.requester.created_at.iso8601(3),
            'updated_at' => procedure.requester.updated_at.iso8601(3),
            'blocked' => procedure.requester.blocked
          }
        }
      )
    end
  end

  describe 'PUT /v3/printer_flow/group_requesters/:group_requester_id/procedures/:procedure_id/finish' do
    let(:procedure) do
      create(:printer_flow_procedure, :internal, :started, :with_finished_task,
             responsible_group_id: group_requester.id, created_by: user)
    end

    it 'responds with status ok' do
      put "/v3/printer_flow/group_requesters/#{group_requester.id}/procedures/#{procedure.id}/finish",
          headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'renders a JSON with the finished procedure' do
      put "/v3/printer_flow/group_requesters/#{group_requester.id}/procedures/#{procedure.id}/finish",
          headers: credentials

      procedure.reload

      expect(JSON.parse(response.body)).to include(
        {
          'id' => procedure.id,
          'organization_id' => procedure.organization_id,
          'responsible_group_id' => procedure.responsible_group_id,
          'prn' => procedure.prn,
          'process_number' => procedure.process_number,
          'deadline' => procedure.deadline.to_s,
          'status' => procedure.status,
          'source' => procedure.source,
          'private' => procedure.private,
          'priority' => procedure.priority,
          'payload' => procedure.payload,
          'procedure_template_id' => procedure.procedure_template_id,
          'procedure_template_name' => procedure.procedure_template_name,
          'parent_procedure_template_name' => procedure.procedure_template.parent_procedure_template.name,
          'requester_id' => procedure.requester_id,
          'schema' => procedure.schema,
          'created_at' => procedure.created_at.iso8601(3),
          'updated_at' => procedure.updated_at.iso8601(3),
          'created_by_id' => procedure.created_by_id,
          'created_by' => {
            'avatar_url' => user.avatar_url,
            'changed_password' => false,
            'cpf' => user.cpf,
            'created_at' => user.created_at.iso8601(3),
            'date_of_birth' => user.date_of_birth.to_s,
            'deleted_at' => user.deleted_at,
            'email' => user.email,
            'id' => user.id,
            'name' => user.name,
            'organization_id' => user.organization_id,
            'phone' => user.phone,
            'prn' => user.prn,
            'registration_number' => nil,
            'status' => user.status,
            'updated_at' => user.created_at.iso8601(3),
            'username' => user.username
          },
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
            'code' => procedure.requester.code,
            'birth_date' => procedure.requester.birth_date,
            'cpf_cnpj' => procedure.requester.cpf_cnpj,
            'email' => procedure.requester.email,
            'id' => procedure.requester.id,
            'name' => procedure.requester.name,
            'occupation' => procedure.requester.occupation,
            'optional_email' => procedure.requester.optional_email,
            'optional_phone' => procedure.requester.optional_phone,
            'organization_id' => procedure.requester.organization_id,
            'parent_group_id' => procedure.requester.parent_group_id,
            'phone' => procedure.requester.phone,
            'prn' => procedure.requester.prn,
            'status' => procedure.requester.status,
            'type' => procedure.requester.type,
            'created_at' => procedure.requester.created_at.iso8601(3),
            'updated_at' => procedure.requester.updated_at.iso8601(3),
            'blocked' => procedure.requester.blocked
          }
        }
      )
    end
  end

  describe 'GET /v3/printer_flow/procedures/count_by_status' do
    it 'responds with status ok' do
      get '/v3/printer_flow/procedures/count_by_status', headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'renders a JSON with procedures count by status' do
      get '/v3/printer_flow/procedures/count_by_status', headers: credentials

      expect(JSON.parse(response.body)).to include(
        {
          'draft' => 1,
          'running' => 0,
          'finished' => 0,
          'archived' => 0
        }
      )
    end
  end
end
