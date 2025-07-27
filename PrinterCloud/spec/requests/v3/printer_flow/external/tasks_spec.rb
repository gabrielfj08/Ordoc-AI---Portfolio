require 'rails_helper'

RSpec.describe 'PrinterFlow::Task', type: :request do
  let!(:task) do
    create(:printer_flow_task, :started, procedure: procedure, group_assignee: requester, assignee: requester)
  end
  let(:procedure) do
    create(:printer_flow_procedure, :started, :external, organization: requester.organization,
                                                         requester_id: requester.id)
  end
  let(:requester) { create(:external_requester) }

  let(:credentials) do
    { 'Authorization' => "Bearer #{requester.token}",
      'X-Api-Subdomain' => requester.organization.subdomain }
  end

  describe 'GET /v3/printer_flow/external/tasks' do
    it 'responds with status ok' do
      get '/v3/printer_flow/external/tasks', headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'renders a JSON with all tasks' do
      get '/v3/printer_flow/external/tasks', headers: credentials

      expect(JSON.parse(response.body)).to include(
        'printer_flow/tasks' => [{
          'id' => task.id,
          'name' => task.name,
          'status' => task.status,
          'description' => task.description,
          'procedure_id' => task.procedure_id,
          'created_at' => task.created_at.iso8601(3),
          'updated_at' => task.updated_at.iso8601(3),
          'procedure_info' => task.procedure_info,
          'created_by_id' => task.created_by_id,
          'created_by' => { 'id' => task.created_by.id,
                            'name' => task.created_by.name,
                            'email' => task.created_by.email,
                            'cpf' => task.created_by.cpf,
                            'date_of_birth' => task.created_by.date_of_birth.to_s,
                            'avatar_url' => task.created_by.avatar_url,
                            'organization_id' => task.created_by.organization_id,
                            'phone' => task.created_by.phone,
                            'prn' => task.created_by.prn,
                            'status' => task.created_by.status,
                            'username' => task.created_by.username,
                            'changed_password' => task.created_by.changed_password,
                            'registration_number' => task.created_by.registration_number,
                            'created_at' => task.created_by.created_at.iso8601(3),
                            'updated_at' => task.created_by.updated_at.iso8601(3),
                            'deleted_at' => task.created_by.deleted_at }
        }],
        'meta' => {
          'total' => 1
        }
      )
    end
  end

  describe 'GET /v3/printer_flow/external/tasks/:id' do
    it 'responds with status ok' do
      get "/v3/printer_flow/external/tasks/#{task.id}", headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'renders a JSON with a task' do
      get "/v3/printer_flow/external/tasks/#{task.id}", headers: credentials

      expect(JSON.parse(response.body)).to include(
        {
          'id' => task.id,
          'name' => task.name,
          'description' => task.description,
          'status' => task.status,
          'procedure_id' => task.procedure_id,
          'created_at' => task.created_at.iso8601(3),
          'updated_at' => task.updated_at.iso8601(3),
          'created_by_id' => task.created_by_id,
          'created_by' => { 'id' => task.created_by.id,
                            'name' => task.created_by.name,
                            'email' => task.created_by.email,
                            'cpf' => task.created_by.cpf,
                            'date_of_birth' => task.created_by.date_of_birth.to_s,
                            'avatar_url' => task.created_by.avatar_url,
                            'organization_id' => task.created_by.organization_id,
                            'phone' => task.created_by.phone,
                            'prn' => task.created_by.prn,
                            'status' => task.created_by.status,
                            'username' => task.created_by.username,
                            'changed_password' => task.created_by.changed_password,
                            'registration_number' => task.created_by.registration_number,
                            'created_at' => task.created_by.created_at.iso8601(3),
                            'updated_at' => task.created_by.updated_at.iso8601(3),
                            'deleted_at' => task.created_by.deleted_at },
          'procedure' => { 'id' => task.procedure.id,
                           'created_by_id' => task.procedure.created_by_id,
                           'deadline' => task.procedure.deadline.to_s,
                           'organization_id' => task.procedure.organization_id,
                           'payload' => task.procedure.payload,
                           'priority' => task.procedure.priority,
                           'private' => task.procedure.private,
                           'prn' => task.procedure.prn,
                           'procedure_template_id' => task.procedure.procedure_template_id,
                           'procedure_template_name' => task.procedure.procedure_template_name,
                           'process_number' => task.procedure.process_number,
                           'requester_id' => task.procedure.requester_id,
                           'responsible_group_id' => task.procedure.responsible_group_id,
                           'schema' => task.procedure.schema,
                           'source' => task.procedure.source,
                           'status' => task.procedure.status,
                           'updated_at' => task.procedure.updated_at.iso8601(3),
                           'created_at' => task.procedure.created_at.iso8601(3) },
          'group_assignee' => { 'id' => task.group_assignee.id,
                                'name' => task.group_assignee.name,
                                'organization_id' => task.group_assignee.organization_id,
                                'parent_group_id' => nil,
                                'prn' => task.group_assignee.prn,
                                'email' => task.group_assignee.email,
                                'type' => task.group_assignee.type,
                                'cpf_cnpj' => task.group_assignee.cpf_cnpj,
                                'code' => task.group_assignee.code,
                                'status' => task.group_assignee.status,
                                'blocked' => task.group_assignee.blocked,
                                'birth_date' => task.group_assignee.birth_date.to_s,
                                'phone' => task.group_assignee.phone,
                                'optional_email' => task.group_assignee.optional_email,
                                'optional_phone' => task.group_assignee.optional_phone,
                                'occupation' => task.group_assignee.occupation,
                                'created_at' => task.group_assignee.created_at.iso8601(3),
                                'updated_at' => task.group_assignee.updated_at.iso8601(3) },
          'assignee' => { 'id' => task.assignee.id,
                          'name' => task.assignee.name,
                          'organization_id' => task.assignee.organization_id,
                          'parent_group_id' => nil,
                          'prn' => task.assignee.prn,
                          'email' => task.assignee.email,
                          'type' => task.assignee.type,
                          'cpf_cnpj' => task.assignee.cpf_cnpj,
                          'code' => task.assignee.code,
                          'status' => task.assignee.status,
                          'blocked' => task.assignee.blocked,
                          'birth_date' => task.assignee.birth_date.to_s,
                          'phone' => task.assignee.phone,
                          'optional_email' => task.assignee.optional_email,
                          'optional_phone' => task.assignee.optional_phone,
                          'occupation' => task.assignee.occupation,
                          'created_at' => task.assignee.created_at.iso8601(3),
                          'updated_at' => task.assignee.updated_at.iso8601(3) }

        }
      )
    end
  end

  describe 'PUT /v3/printer_flow/external/tasks/:task_id/accept' do
    let(:task) do
      create(:printer_flow_task, :running, procedure: procedure, group_assignee: requester)
    end

    it 'responds with status ok' do
      put "/v3/printer_flow/external/tasks/#{task.id}/accept", headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'renders a JSON with the accepted task' do
      put "/v3/printer_flow/external/tasks/#{task.id}/accept", headers: credentials

      task.reload

      expect(JSON.parse(response.body)).to include(
        {
          'id' => task.id,
          'name' => task.name,
          'description' => task.description,
          'status' => task.status,
          'procedure_id' => task.procedure_id,
          'created_at' => task.created_at.iso8601(3),
          'updated_at' => task.updated_at.iso8601(3),
          'created_by_id' => task.created_by_id,
          'created_by' => { 'id' => task.created_by.id,
                            'name' => task.created_by.name,
                            'email' => task.created_by.email,
                            'cpf' => task.created_by.cpf,
                            'date_of_birth' => task.created_by.date_of_birth.to_s,
                            'avatar_url' => task.created_by.avatar_url,
                            'organization_id' => task.created_by.organization_id,
                            'phone' => task.created_by.phone,
                            'prn' => task.created_by.prn,
                            'status' => task.created_by.status,
                            'username' => task.created_by.username,
                            'changed_password' => task.created_by.changed_password,
                            'registration_number' => task.created_by.registration_number,
                            'created_at' => task.created_by.created_at.iso8601(3),
                            'updated_at' => task.created_by.updated_at.iso8601(3),
                            'deleted_at' => task.created_by.deleted_at },
          'procedure' => { 'id' => task.procedure.id,
                           'created_by_id' => task.procedure.created_by_id,
                           'deadline' => task.procedure.deadline.to_s,
                           'organization_id' => task.procedure.organization_id,
                           'payload' => task.procedure.payload,
                           'priority' => task.procedure.priority,
                           'private' => task.procedure.private,
                           'prn' => task.procedure.prn,
                           'procedure_template_id' => task.procedure.procedure_template_id,
                           'procedure_template_name' => task.procedure.procedure_template_name,
                           'process_number' => task.procedure.process_number,
                           'requester_id' => task.procedure.requester_id,
                           'responsible_group_id' => task.procedure.responsible_group_id,
                           'schema' => task.procedure.schema,
                           'source' => task.procedure.source,
                           'status' => task.procedure.status,
                           'updated_at' => task.procedure.updated_at.iso8601(3),
                           'created_at' => task.procedure.created_at.iso8601(3) },
          'group_assignee' => { 'id' => task.group_assignee.id,
                                'name' => task.group_assignee.name,
                                'organization_id' => task.group_assignee.organization_id,
                                'parent_group_id' => nil,
                                'prn' => task.group_assignee.prn,
                                'email' => task.group_assignee.email,
                                'type' => task.group_assignee.type,
                                'cpf_cnpj' => task.group_assignee.cpf_cnpj,
                                'code' => task.group_assignee.code,
                                'status' => task.group_assignee.status,
                                'blocked' => task.group_assignee.blocked,
                                'birth_date' => task.group_assignee.birth_date.to_s,
                                'phone' => task.group_assignee.phone,
                                'optional_email' => task.group_assignee.optional_email,
                                'optional_phone' => task.group_assignee.optional_phone,
                                'occupation' => task.group_assignee.occupation,
                                'created_at' => task.group_assignee.created_at.iso8601(3),
                                'updated_at' => task.group_assignee.updated_at.iso8601(3) },
          'assignee' => { 'id' => task.assignee.id,
                          'name' => task.assignee.name,
                          'organization_id' => task.assignee.organization_id,
                          'parent_group_id' => nil,
                          'prn' => task.assignee.prn,
                          'email' => task.assignee.email,
                          'type' => task.assignee.type,
                          'cpf_cnpj' => task.assignee.cpf_cnpj,
                          'code' => task.assignee.code,
                          'status' => task.assignee.status,
                          'blocked' => task.assignee.blocked,
                          'birth_date' => task.assignee.birth_date.to_s,
                          'phone' => task.assignee.phone,
                          'optional_email' => task.assignee.optional_email,
                          'optional_phone' => task.assignee.optional_phone,
                          'occupation' => task.assignee.occupation,
                          'created_at' => task.assignee.created_at.iso8601(3),
                          'updated_at' => task.assignee.updated_at.iso8601(3) }
        }
      )
    end
  end

  describe 'PUT /v3/printer_flow/external/tasks/:task_id/refuse' do
    let(:task) do
      create(:printer_flow_task, :running, procedure: procedure, group_assignee: requester)
    end
    let(:params) do
      { note: 'Tarefa está incompleta' }
    end

    it 'responds with status ok' do
      put "/v3/printer_flow/external/tasks/#{task.id}/refuse", headers: credentials, params: params

      expect(response).to have_http_status(:ok)
    end

    it 'renders a JSON with the refused task' do
      put "/v3/printer_flow/external/tasks/#{task.id}/refuse", headers: credentials, params: params

      task.reload

      expect(JSON.parse(response.body)).to include(
        {
          'id' => task.id,
          'name' => task.name,
          'description' => task.description,
          'status' => task.status,
          'procedure_id' => task.procedure_id,
          'created_at' => task.created_at.iso8601(3),
          'updated_at' => task.updated_at.iso8601(3),
          'created_by_id' => task.created_by_id,
          'created_by' => { 'id' => task.created_by.id,
                            'name' => task.created_by.name,
                            'email' => task.created_by.email,
                            'cpf' => task.created_by.cpf,
                            'date_of_birth' => task.created_by.date_of_birth.to_s,
                            'avatar_url' => task.created_by.avatar_url,
                            'organization_id' => task.created_by.organization_id,
                            'phone' => task.created_by.phone,
                            'prn' => task.created_by.prn,
                            'status' => task.created_by.status,
                            'username' => task.created_by.username,
                            'changed_password' => task.created_by.changed_password,
                            'registration_number' => task.created_by.registration_number,
                            'created_at' => task.created_by.created_at.iso8601(3),
                            'updated_at' => task.created_by.updated_at.iso8601(3),
                            'deleted_at' => task.created_by.deleted_at },
          'procedure' => { 'id' => task.procedure.id,
                           'created_by_id' => task.procedure.created_by_id,
                           'deadline' => task.procedure.deadline.to_s,
                           'organization_id' => task.procedure.organization_id,
                           'payload' => task.procedure.payload,
                           'priority' => task.procedure.priority,
                           'private' => task.procedure.private,
                           'prn' => task.procedure.prn,
                           'procedure_template_id' => task.procedure.procedure_template_id,
                           'procedure_template_name' => task.procedure.procedure_template_name,
                           'process_number' => task.procedure.process_number,
                           'requester_id' => task.procedure.requester_id,
                           'responsible_group_id' => task.procedure.responsible_group_id,
                           'schema' => task.procedure.schema,
                           'source' => task.procedure.source,
                           'status' => task.procedure.status,
                           'updated_at' => task.procedure.updated_at.iso8601(3),
                           'created_at' => task.procedure.created_at.iso8601(3) },
          'group_assignee' => { 'id' => task.group_assignee.id,
                                'name' => task.group_assignee.name,
                                'organization_id' => task.group_assignee.organization_id,
                                'parent_group_id' => nil,
                                'prn' => task.group_assignee.prn,
                                'email' => task.group_assignee.email,
                                'type' => task.group_assignee.type,
                                'cpf_cnpj' => task.group_assignee.cpf_cnpj,
                                'code' => task.group_assignee.code,
                                'status' => task.group_assignee.status,
                                'blocked' => task.group_assignee.blocked,
                                'birth_date' => task.group_assignee.birth_date.to_s,
                                'phone' => task.group_assignee.phone,
                                'optional_email' => task.group_assignee.optional_email,
                                'optional_phone' => task.group_assignee.optional_phone,
                                'occupation' => task.group_assignee.occupation,
                                'created_at' => task.group_assignee.created_at.iso8601(3),
                                'updated_at' => task.group_assignee.updated_at.iso8601(3) },
          'assignee' => { 'id' => task.assignee.id,
                          'name' => task.assignee.name,
                          'organization_id' => task.assignee.organization_id,
                          'parent_group_id' => nil,
                          'prn' => task.assignee.prn,
                          'email' => task.assignee.email,
                          'type' => task.assignee.type,
                          'cpf_cnpj' => task.assignee.cpf_cnpj,
                          'code' => task.assignee.code,
                          'status' => task.assignee.status,
                          'blocked' => task.assignee.blocked,
                          'birth_date' => task.assignee.birth_date.to_s,
                          'phone' => task.assignee.phone,
                          'optional_email' => task.assignee.optional_email,
                          'optional_phone' => task.assignee.optional_phone,
                          'occupation' => task.assignee.occupation,
                          'created_at' => task.assignee.created_at.iso8601(3),
                          'updated_at' => task.assignee.updated_at.iso8601(3) }
        }
      )
    end
  end

  describe 'PUT /v3/printer_flow/external/tasks/:task_id/finish' do
    let!(:task_comment) do
      create(:task_comment, task_id: task.id, created_by_id: requester.id)
    end

    it 'responds with status ok' do
      put "/v3/printer_flow/external/tasks/#{task.id}/finish", headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'renders a JSON with the finished tasks' do
      put "/v3/printer_flow/external/tasks/#{task.id}/finish", headers: credentials

      task.reload

      expect(JSON.parse(response.body)).to include(
        {
          'id' => task.id,
          'name' => task.name,
          'description' => task.description,
          'status' => task.status,
          'procedure_id' => task.procedure_id,
          'created_at' => task.created_at.iso8601(3),
          'updated_at' => task.updated_at.iso8601(3),
          'created_by_id' => task.created_by_id,
          'created_by' => { 'id' => task.created_by.id,
                            'name' => task.created_by.name,
                            'email' => task.created_by.email,
                            'cpf' => task.created_by.cpf,
                            'date_of_birth' => task.created_by.date_of_birth.to_s,
                            'avatar_url' => task.created_by.avatar_url,
                            'organization_id' => task.created_by.organization_id,
                            'phone' => task.created_by.phone,
                            'prn' => task.created_by.prn,
                            'status' => task.created_by.status,
                            'username' => task.created_by.username,
                            'changed_password' => task.created_by.changed_password,
                            'registration_number' => task.created_by.registration_number,
                            'created_at' => task.created_by.created_at.iso8601(3),
                            'updated_at' => task.created_by.updated_at.iso8601(3),
                            'deleted_at' => task.created_by.deleted_at },
          'procedure' => { 'id' => task.procedure.id,
                           'created_by_id' => task.procedure.created_by_id,
                           'deadline' => task.procedure.deadline.to_s,
                           'organization_id' => task.procedure.organization_id,
                           'payload' => task.procedure.payload,
                           'priority' => task.procedure.priority,
                           'private' => task.procedure.private,
                           'prn' => task.procedure.prn,
                           'procedure_template_id' => task.procedure.procedure_template_id,
                           'procedure_template_name' => task.procedure.procedure_template_name,
                           'process_number' => task.procedure.process_number,
                           'requester_id' => task.procedure.requester_id,
                           'responsible_group_id' => task.procedure.responsible_group_id,
                           'schema' => task.procedure.schema,
                           'source' => task.procedure.source,
                           'status' => task.procedure.status,
                           'updated_at' => task.procedure.updated_at.iso8601(3),
                           'created_at' => task.procedure.created_at.iso8601(3) },
          'group_assignee' => { 'id' => task.assignee.id,
                                'name' => task.assignee.name,
                                'organization_id' => task.assignee.organization_id,
                                'parent_group_id' => nil,
                                'prn' => task.assignee.prn,
                                'email' => task.assignee.email,
                                'type' => task.assignee.type,
                                'cpf_cnpj' => task.assignee.cpf_cnpj,
                                'code' => task.assignee.code,
                                'status' => task.assignee.status,
                                'blocked' => task.assignee.blocked,
                                'birth_date' => task.assignee.birth_date.to_s,
                                'phone' => task.assignee.phone,
                                'optional_email' => task.assignee.optional_email,
                                'optional_phone' => task.assignee.optional_phone,
                                'occupation' => task.assignee.occupation,
                                'created_at' => task.assignee.created_at.iso8601(3),
                                'updated_at' => task.assignee.updated_at.iso8601(3) },
          'assignee' => { 'id' => task.assignee.id,
                          'name' => task.assignee.name,
                          'organization_id' => task.assignee.organization_id,
                          'parent_group_id' => nil,
                          'prn' => task.assignee.prn,
                          'email' => task.assignee.email,
                          'type' => task.assignee.type,
                          'cpf_cnpj' => task.assignee.cpf_cnpj,
                          'code' => task.assignee.code,
                          'status' => task.assignee.status,
                          'blocked' => task.assignee.blocked,
                          'birth_date' => task.assignee.birth_date.to_s,
                          'phone' => task.assignee.phone,
                          'optional_email' => task.assignee.optional_email,
                          'optional_phone' => task.assignee.optional_phone,
                          'occupation' => task.assignee.occupation,
                          'created_at' => task.assignee.created_at.iso8601(3),
                          'updated_at' => task.assignee.updated_at.iso8601(3) }
        }
      )
    end
  end
end
