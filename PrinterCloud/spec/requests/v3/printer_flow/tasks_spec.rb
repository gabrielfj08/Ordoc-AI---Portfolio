require 'rails_helper'

RSpec.describe 'PrinterFlow::Task', type: :request do
  let!(:task) { create(:printer_flow_task, procedure: procedure, created_by: user) }
  let!(:requester_assignment) { create(:requester_assignment, user: user, requester: group_assignee) }
  let(:user) { create(:printer_cloud_user) }
  let(:group_assignee) { create(:group_requester, organization: user.organization) }
  let(:procedure) { create(:printer_flow_procedure, :running, created_by: user) }

  let(:credentials) do
    { 'Authorization' => "Bearer #{user.token}",
      'X-Api-Subdomain' => user.organization.subdomain }
  end

  describe 'GET /v3/printer_flow/tasks' do
    it 'responds with status ok' do
      get '/v3/printer_flow/tasks', headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'renders a JSON with all tasks' do
      get '/v3/printer_flow/tasks', headers: credentials

      expect(JSON.parse(response.body)).to include(
        'printer_flow/tasks' => [{
          'id' => task.id,
          'name' => task.name,
          'description' => task.description,
          'group_assignee_id' => task.group_assignee_id,
          'prn' => task.prn,
          'deadline' => task.deadline,
          'status' => task.status,
          'priority' => task.priority,
          'procedure_id' => task.procedure_id,
          'assignee_id' => task.assignee_id,
          'task_template_id' => task.task_template_id,
          'created_at' => task.created_at.iso8601(3),
          'updated_at' => task.updated_at.iso8601(3),
          'created_by_id' => task.created_by_id,
          'procedure_info' => task.procedure_info,
          'assignee' => task.assignee,
          'procedure' => {  'id' => procedure.id,
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
                            'created_by_id' => procedure.created_by_id },
          'group_assignee' => task.group_assignee
        }],
        'meta' => {
          'total' => 1
        }
      )
    end
  end

  describe 'GET /v3/printer_flow/tasks/:id' do
    it 'responds with status ok' do
      get "/v3/printer_flow/tasks/#{task.id}", headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'renders a JSON with a task' do
      get "/v3/printer_flow/tasks/#{task.id}", headers: credentials

      expect(JSON.parse(response.body)).to include(
        {
          'id' => task.id,
          'name' => task.name,
          'description' => task.description,
          'group_assignee_id' => task.group_assignee_id,
          'prn' => task.prn,
          'deadline' => task.deadline,
          'status' => task.status,
          'task_template_id' => task.task_template_id,
          'priority' => task.priority,
          'procedure_id' => task.procedure_id,
          'assignee_id' => task.assignee_id,
          'created_at' => task.created_at.iso8601(3),
          'updated_at' => task.updated_at.iso8601(3),
          'created_by_id' => task.created_by_id,
          'task_template' => { 'id' => task.task_template.id,
                               'name' => task.task_template.name,
                               'description' => task.task_template.description,
                               'status' => task.task_template.status,
                               'organization_id' => task.task_template.organization_id,
                               'prn' => task.task_template.prn,
                               'created_at' => task.task_template.created_at.iso8601(3),
                               'updated_at' => task.task_template.updated_at.iso8601(3) }
        }
      )
    end
  end

  describe 'POST /v3/printer_flow/tasks' do
    let(:create_params) do
      {
        task: {
          name: 'Assinar o documento anexado',
          description: 'Assinar o mais rápido possível.',
          procedure_id: procedure.id
        }
      }
    end

    it 'responds with status created' do
      post '/v3/printer_flow/tasks', headers: credentials, params: create_params

      expect(response).to have_http_status(:created)
    end

    it 'renders a JSON with the created task' do
      post '/v3/printer_flow/tasks', headers: credentials, params: create_params

      task_id = JSON.parse(response.body)['id']
      task = ::PrinterFlow::Task.find(task_id)

      expect(JSON.parse(response.body)).to include(
        {
          'id' => task.id,
          'name' => task.name,
          'description' => task.description,
          'group_assignee_id' => task.group_assignee_id,
          'prn' => task.prn,
          'deadline' => task.deadline,
          'status' => task.status,
          'priority' => task.priority,
          'procedure_id' => task.procedure_id,
          'assignee_id' => task.assignee_id,
          'task_template_id' => task.task_template_id,
          'task_template' => task.task_template,
          'created_at' => task.created_at.iso8601(3),
          'updated_at' => task.updated_at.iso8601(3),
          'created_by_id' => task.created_by_id
        }
      )
    end
  end

  describe 'PUT /v3/printer_flow/tasks/:id' do
    let(:update_params) do
      {
        name: 'Assinar o  Documento',
        description: 'Assine este documento para prosseguir com o processo',
        group_assignee_id: group_assignee.id,
        priority: task.priority,
        deadline: '10/12/3000'
      }
    end
    it 'responds with status ok' do
      put "/v3/printer_flow/tasks/#{task.id}", headers: credentials, params: update_params

      expect(response).to have_http_status(:ok)
    end

    it 'renders a JSON with the updated task' do
      put "/v3/printer_flow/tasks/#{task.id}", headers: credentials, params: update_params

      task.reload

      expect(JSON.parse(response.body)).to include(
        {
          'id' => task.id,
          'name' => task.name,
          'description' => task.description,
          'group_assignee_id' => task.group_assignee_id,
          'prn' => task.prn,
          'deadline' => task.deadline.to_s,
          'status' => task.status,
          'priority' => task.priority,
          'procedure_id' => task.procedure_id,
          'assignee_id' => task.assignee_id,
          'task_template_id' => task.task_template_id,
          'created_at' => task.created_at.iso8601(3),
          'updated_at' => task.updated_at.iso8601(3),
          'created_by_id' => task.created_by_id,
          'task_fields' => [],
          'assignee' => task.assignee,
          'task_template' => { 'id' => task.task_template.id,
                               'name' => task.task_template.name,
                               'description' => task.task_template.description,
                               'status' => task.task_template.status,
                               'organization_id' => task.task_template.organization_id,
                               'prn' => task.task_template.prn,
                               'created_at' => task.task_template.created_at.iso8601(3),
                               'updated_at' => task.task_template.updated_at.iso8601(3) },
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
          'created_by' => { 'id' => task.created_by.id,
                            'avatar_url' => task.created_by.avatar_url,
                            'changed_password' => false,
                            'email' => task.created_by.email,
                            'created_at' => task.created_by.created_at.iso8601(3),
                            'updated_at' => task.created_by.updated_at.iso8601(3),
                            'name' => task.created_by.name,
                            'organization_id' => task.created_by.organization_id,
                            'phone' => task.created_by.phone,
                            'prn' => task.created_by.prn,
                            'cpf' => task.created_by.cpf,
                            'username' => task.created_by.username,
                            'deleted_at' => task.created_by.deleted_at,
                            'date_of_birth' => task.created_by.date_of_birth.to_s,
                            'registration_number' => task.created_by.registration_number,
                            'status' => task.created_by.status },
          'group_assignee' => task.group_assignee
        }
      )
    end
  end

  describe 'DELETE /v3/printer_flow/tasks/:id' do
    it 'responds with status ok' do
      delete "/v3/printer_flow/tasks/#{task.id}", headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'renders a JSON with the deleted task' do
      delete "/v3/printer_flow/tasks/#{task.id}", headers: credentials

      expect(JSON.parse(response.body)).to include(
        {
          'id' => task.id,
          'name' => task.name,
          'description' => task.description,
          'group_assignee_id' => task.group_assignee_id,
          'prn' => task.prn,
          'task_fields' => [],
          'deadline' => task.deadline,
          'status' => task.status,
          'priority' => task.priority,
          'procedure_id' => task.procedure_id,
          'assignee_id' => task.assignee_id,
          'assignee' => task.assignee,
          'task_template_id' => task.task_template_id,
          'created_at' => task.created_at.iso8601(3),
          'updated_at' => task.updated_at.iso8601(3),
          'created_by_id' => task.created_by_id,
          'task_template' => { 'id' => task.task_template.id,
                               'name' => task.task_template.name,
                               'description' => task.task_template.description,
                               'status' => task.task_template.status,
                               'organization_id' => task.task_template.organization_id,
                               'prn' => task.task_template.prn,
                               'created_at' => task.task_template.created_at.iso8601(3),
                               'updated_at' => task.task_template.updated_at.iso8601(3) },
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
          'created_by' => { 'id' => task.created_by.id,
                            'avatar_url' => task.created_by.avatar_url,
                            'changed_password' => false,
                            'email' => task.created_by.email,
                            'created_at' => task.created_by.created_at.iso8601(3),
                            'updated_at' => task.created_by.updated_at.iso8601(3),
                            'name' => task.created_by.name,
                            'organization_id' => task.created_by.organization_id,
                            'phone' => task.created_by.phone,
                            'prn' => task.created_by.prn,
                            'cpf' => task.created_by.cpf,
                            'username' => task.created_by.username,
                            'deleted_at' => task.created_by.deleted_at,
                            'date_of_birth' => task.created_by.date_of_birth.to_s,
                            'registration_number' => task.created_by.registration_number,
                            'status' => task.created_by.status },
          'group_assignee' => task.group_assignee
        }
      )
    end
  end

  describe 'PUT /v3/printer_flow/tasks/:task_id/accept' do
    let(:task) { create(:printer_flow_task, :running, group_assignee: group_assignee, procedure: procedure) }

    it 'responds with status ok' do
      put "/v3/printer_flow/tasks/#{task.id}/accept", headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'renders a JSON with the accepted task' do
      put "/v3/printer_flow/tasks/#{task.id}/accept", headers: credentials

      task.reload

      expect(JSON.parse(response.body)).to include(
        {
          'id' => task.id,
          'name' => task.name,
          'description' => task.description,
          'group_assignee_id' => task.group_assignee_id,
          'prn' => task.prn,
          'deadline' => task.deadline,
          'status' => task.status,
          'priority' => task.priority,
          'task_template_id' => task.task_template_id,
          'procedure_id' => task.procedure_id,
          'assignee_id' => task.assignee_id,
          'created_at' => task.created_at.iso8601(3),
          'updated_at' => task.updated_at.iso8601(3),
          'created_by_id' => task.created_by_id,
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
                          'updated_at' => task.assignee.updated_at.iso8601(3) },
          'task_template' => { 'id' => task.task_template.id,
                               'name' => task.task_template.name,
                               'description' => task.task_template.description,
                               'status' => task.task_template.status,
                               'organization_id' => task.task_template.organization_id,
                               'prn' => task.task_template.prn,
                               'created_at' => task.task_template.created_at.iso8601(3),
                               'updated_at' => task.task_template.updated_at.iso8601(3) },
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
          'created_by' => { 'id' => task.created_by.id,
                            'avatar_url' => task.created_by.avatar_url,
                            'changed_password' => false,
                            'email' => task.created_by.email,
                            'created_at' => task.created_by.created_at.iso8601(3),
                            'updated_at' => task.created_by.updated_at.iso8601(3),
                            'name' => task.created_by.name,
                            'organization_id' => task.created_by.organization_id,
                            'phone' => task.created_by.phone,
                            'prn' => task.created_by.prn,
                            'cpf' => task.created_by.cpf,
                            'username' => task.created_by.username,
                            'deleted_at' => task.created_by.deleted_at,
                            'date_of_birth' => task.created_by.date_of_birth.to_s,
                            'registration_number' => task.created_by.registration_number,
                            'status' => task.created_by.status },
          'group_assignee' => { 'code' => task.group_assignee.code,
                                'created_at' => task.group_assignee.created_at.iso8601(3),
                                'id' => task.group_assignee.id,
                                'name' => task.group_assignee.name,
                                'parent_group_id' => nil,
                                'prn' => task.group_assignee.prn,
                                'status' => task.group_assignee.status,
                                'updated_at' => task.group_assignee.updated_at.iso8601(3) }
        }
      )
    end
  end

  describe 'PUT /v3/printer_flow/tasks/:task_id/refuse' do
    let(:task) do
      create(:printer_flow_task, name: 'Consertar o teste 2', status: :running, group_assignee: group_assignee,
                                 procedure: procedure)
    end
    let(:refuse_params) do
      {
        note: 'tarefa esta incompleta'
      }
    end

    it 'responds with status ok' do
      put "/v3/printer_flow/tasks/#{task.id}/refuse", headers: credentials, params: refuse_params
      expect(response).to have_http_status(:ok)
    end

    it 'renders a JSON with the refused task' do
      put "/v3/printer_flow/tasks/#{task.id}/refuse", headers: credentials, params: refuse_params

      task.reload

      expect(JSON.parse(response.body)).to include(
        {
          'id' => task.id,
          'name' => task.name,
          'description' => task.description,
          'group_assignee_id' => task.group_assignee_id,
          'prn' => task.prn,
          'deadline' => task.deadline,
          'status' => task.status,
          'task_template_id' => task.task_template_id,
          'priority' => task.priority,
          'procedure_id' => task.procedure_id,
          'assignee_id' => task.assignee_id,
          'created_at' => task.created_at.iso8601(3),
          'updated_at' => task.updated_at.iso8601(3),
          'created_by_id' => task.created_by_id,
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
                          'updated_at' => task.assignee.updated_at.iso8601(3) },
          'task_template' => { 'id' => task.task_template.id,
                               'name' => task.task_template.name,
                               'description' => task.task_template.description,
                               'status' => task.task_template.status,
                               'organization_id' => task.task_template.organization_id,
                               'prn' => task.task_template.prn,
                               'created_at' => task.task_template.created_at.iso8601(3),
                               'updated_at' => task.task_template.updated_at.iso8601(3) },
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
          'created_by' => { 'id' => task.created_by.id,
                            'avatar_url' => task.created_by.avatar_url,
                            'changed_password' => false,
                            'email' => task.created_by.email,
                            'created_at' => task.created_by.created_at.iso8601(3),
                            'updated_at' => task.created_by.updated_at.iso8601(3),
                            'name' => task.created_by.name,
                            'organization_id' => task.created_by.organization_id,
                            'phone' => task.created_by.phone,
                            'prn' => task.created_by.prn,
                            'cpf' => task.created_by.cpf,
                            'username' => task.created_by.username,
                            'deleted_at' => task.created_by.deleted_at,
                            'date_of_birth' => task.created_by.date_of_birth.to_s,
                            'registration_number' => task.created_by.registration_number,
                            'status' => task.created_by.status },
          'group_assignee' => { 'code' => task.group_assignee.code,
                                'created_at' => task.group_assignee.created_at.iso8601(3),
                                'id' => task.group_assignee.id,
                                'name' => task.group_assignee.name,
                                'parent_group_id' => nil,
                                'prn' => task.group_assignee.prn,
                                'status' => task.group_assignee.status,
                                'updated_at' => task.group_assignee.updated_at.iso8601(3) }
        }
      )
    end
  end

  describe 'PUT /v3/printer_flow/tasks/:task_id/set_assignee' do
    let(:assignee_params) do
      {
        group_assignee_id: group_assignee.id
      }
    end
    it 'responds with status ok' do
      put "/v3/printer_flow/tasks/#{task.id}/set_assignee", headers: credentials, params: assignee_params

      expect(response).to have_http_status(:ok)
    end

    it 'renders a JSON with the group assigned to task' do
      put "/v3/printer_flow/tasks/#{task.id}/set_assignee", headers: credentials, params: assignee_params

      task.reload

      expect(JSON.parse(response.body)).to include(
        {
          'id' => task.id,
          'name' => task.name,
          'description' => task.description,
          'group_assignee_id' => task.group_assignee_id,
          'prn' => task.prn,
          'deadline' => task.deadline,
          'status' => task.status,
          'priority' => task.priority,
          'procedure_id' => task.procedure_id,
          'assignee_id' => task.assignee_id,
          'task_template_id' => task.task_template_id,
          'created_at' => task.created_at.iso8601(3),
          'updated_at' => task.updated_at.iso8601(3),
          'created_by_id' => task.created_by_id,
          'task_fields' => [],
          'assignee' => task.assignee,
          'task_template' => { 'id' => task.task_template.id,
                               'name' => task.task_template.name,
                               'description' => task.task_template.description,
                               'status' => task.task_template.status,
                               'organization_id' => task.task_template.organization_id,
                               'prn' => task.task_template.prn,
                               'created_at' => task.task_template.created_at.iso8601(3),
                               'updated_at' => task.task_template.updated_at.iso8601(3) },
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
          'created_by' => { 'id' => task.created_by.id,
                            'avatar_url' => task.created_by.avatar_url,
                            'changed_password' => false,
                            'email' => task.created_by.email,
                            'created_at' => task.created_by.created_at.iso8601(3),
                            'updated_at' => task.created_by.updated_at.iso8601(3),
                            'name' => task.created_by.name,
                            'organization_id' => task.created_by.organization_id,
                            'phone' => task.created_by.phone,
                            'prn' => task.created_by.prn,
                            'cpf' => task.created_by.cpf,
                            'username' => task.created_by.username,
                            'deleted_at' => task.created_by.deleted_at,
                            'date_of_birth' => task.created_by.date_of_birth.to_s,
                            'registration_number' => task.created_by.registration_number,
                            'status' => task.created_by.status },
          'group_assignee' => { 'code' => task.group_assignee.code,
                                'created_at' => task.group_assignee.created_at.iso8601(3),
                                'id' => task.group_assignee.id,
                                'name' => task.group_assignee.name,
                                'parent_group_id' => nil,
                                'prn' => task.group_assignee.prn,
                                'status' => task.group_assignee.status,
                                'updated_at' => task.group_assignee.updated_at.iso8601(3) }
        }
      )
    end
  end

  describe 'PUT /v3/printer_flow/tasks/:task_id/reset_assignee' do
    let(:task) { create(:printer_flow_task, :running, procedure: procedure, created_by: user) }
    let(:group_assignee) { create(:group_requester, organization: user.organization) }
    let(:params) do
      {
        group_assignee_id: group_assignee.id,
        note: 'Encaminhado para o grupo destino'
      }
    end

    it 'responds with status ok' do
      put "/v3/printer_flow/tasks/#{task.id}/reset_assignee", headers: credentials, params: params

      expect(response).to have_http_status(:ok)
    end

    it 'renders a JSON with the new group assigned to task' do
      put "/v3/printer_flow/tasks/#{task.id}/reset_assignee", headers: credentials, params: params

      task.reload

      expect(JSON.parse(response.body)).to include(
        {
          'id' => task.id,
          'name' => task.name,
          'description' => task.description,
          'group_assignee_id' => task.group_assignee_id,
          'prn' => task.prn,
          'deadline' => task.deadline,
          'status' => task.status,
          'priority' => task.priority,
          'procedure_id' => task.procedure_id,
          'assignee_id' => task.assignee_id,
          'assignee' => task.assignee,
          'task_template_id' => task.task_template_id,
          'created_at' => task.created_at.iso8601(3),
          'updated_at' => task.updated_at.iso8601(3),
          'created_by_id' => task.created_by_id,
          'task_template' => { 'id' => task.task_template.id,
                               'name' => task.task_template.name,
                               'description' => task.task_template.description,
                               'status' => task.task_template.status,
                               'organization_id' => task.task_template.organization_id,
                               'prn' => task.task_template.prn,
                               'created_at' => task.task_template.created_at.iso8601(3),
                               'updated_at' => task.task_template.updated_at.iso8601(3) },
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
          'created_by' => { 'id' => task.created_by.id,
                            'avatar_url' => task.created_by.avatar_url,
                            'changed_password' => false,
                            'email' => task.created_by.email,
                            'created_at' => task.created_by.created_at.iso8601(3),
                            'updated_at' => task.created_by.updated_at.iso8601(3),
                            'name' => task.created_by.name,
                            'organization_id' => task.created_by.organization_id,
                            'phone' => task.created_by.phone,
                            'prn' => task.created_by.prn,
                            'cpf' => task.created_by.cpf,
                            'username' => task.created_by.username,
                            'deleted_at' => task.created_by.deleted_at,
                            'date_of_birth' => task.created_by.date_of_birth.to_s,
                            'registration_number' => task.created_by.registration_number,
                            'status' => task.created_by.status },
          'group_assignee' => { 'code' => task.group_assignee.code,
                                'created_at' => task.group_assignee.created_at.iso8601(3),
                                'id' => task.group_assignee.id,
                                'name' => task.group_assignee.name,
                                'parent_group_id' => nil,
                                'prn' => task.group_assignee.prn,
                                'status' => task.group_assignee.status,
                                'updated_at' => task.group_assignee.updated_at.iso8601(3) }
        }
      )
    end
  end

  describe 'PUT /v3/printer_flow/tasks/:task_id/finish' do
    let(:task) { create(:printer_flow_task, status: :started, group_assignee: group_assignee, procedure: procedure) }
    let!(:task_comment) do
      create(:task_comment, task_id: task.id, created_by_id: user.internal_requester.id)
    end

    it 'responds with status ok' do
      put "/v3/printer_flow/tasks/#{task.id}/finish", headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'renders a JSON with the finished tasks' do
      put "/v3/printer_flow/tasks/#{task.id}/finish", headers: credentials

      task.reload

      expect(JSON.parse(response.body)).to include(
        {
          'id' => task.id,
          'name' => task.name,
          'description' => task.description,
          'group_assignee_id' => task.group_assignee_id,
          'prn' => task.prn,
          'deadline' => task.deadline,
          'status' => task.status,
          'priority' => task.priority,
          'procedure_id' => task.procedure_id,
          'assignee_id' => task.assignee_id,
          'task_template_id' => task.task_template_id,
          'assignee' => task.assignee,
          'created_at' => task.created_at.iso8601(3),
          'updated_at' => task.updated_at.iso8601(3),
          'created_by_id' => task.created_by_id,
          'task_template' => { 'id' => task.task_template.id,
                               'name' => task.task_template.name,
                               'description' => task.task_template.description,
                               'status' => task.task_template.status,
                               'organization_id' => task.task_template.organization_id,
                               'prn' => task.task_template.prn,
                               'created_at' => task.task_template.created_at.iso8601(3),
                               'updated_at' => task.task_template.updated_at.iso8601(3) },
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
          'created_by' => { 'id' => task.created_by.id,
                            'avatar_url' => task.created_by.avatar_url,
                            'changed_password' => false,
                            'email' => task.created_by.email,
                            'created_at' => task.created_by.created_at.iso8601(3),
                            'updated_at' => task.created_by.updated_at.iso8601(3),
                            'name' => task.created_by.name,
                            'organization_id' => task.created_by.organization_id,
                            'phone' => task.created_by.phone,
                            'prn' => task.created_by.prn,
                            'cpf' => task.created_by.cpf,
                            'username' => task.created_by.username,
                            'deleted_at' => task.created_by.deleted_at,
                            'date_of_birth' => task.created_by.date_of_birth.to_s,
                            'registration_number' => task.created_by.registration_number,
                            'status' => task.created_by.status },
          'group_assignee' => { 'code' => task.group_assignee.code,
                                'created_at' => task.group_assignee.created_at.iso8601(3),
                                'id' => task.group_assignee.id,
                                'name' => task.group_assignee.name,
                                'parent_group_id' => nil,
                                'prn' => task.group_assignee.prn,
                                'status' => task.group_assignee.status,
                                'updated_at' => task.group_assignee.updated_at.iso8601(3) }
        }
      )
    end
  end

  describe 'GET /v3/printer_flow/tasks/count_by_status' do
    it 'responds with status ok' do
      get '/v3/printer_flow/tasks/count_by_status', headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'renders a JSON with tasks count by status' do
      get '/v3/printer_flow/tasks/count_by_status', headers: credentials

      expect(JSON.parse(response.body)).to include(
        {
          'running' => 0,
          'started' => 0,
          'finished' => 0,
          'returned' => 0
        }
      )
    end
  end

  describe 'PUT /v3/printer_flow/tasks/:task_id/task_fields/:id/update_field' do
    let(:task_field) { create(:task_field, fieldable: task) }
    let(:params) do
      {
        task_field: { value: 'histórinha' }
      }
    end

    it 'responds with status ok' do
      put "/v3/printer_flow/tasks/#{task.id}/task_fields/#{task_field.id}/update_field", params: params,
                                                                                         headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'renders a JSON with updated task field' do
      put "/v3/printer_flow/tasks/#{task.id}/task_fields/#{task_field.id}/update_field", params: params,
                                                                                         headers: credentials

      task_field.reload

      expect(JSON.parse(response.body)).to include(
        {
          'id' => task_field.id,
          'label' => task_field.label,
          'field_type' => task_field.field_type,
          'fieldable_id' => task_field.fieldable_id,
          'fieldable_type' => task_field.fieldable_type,
          'options' => task_field.options,
          'value' => task_field.value,
          'array_values' => task_field.array_values,
          'created_at' => task_field.created_at.iso8601(3),
          'updated_at' => task_field.updated_at.iso8601(3)
        }
      )
    end
  end
end
