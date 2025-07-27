require 'rails_helper'

RSpec.describe 'PrinterFlow::TaskComment', type: :request do
  let!(:task_comment) { create(:task_comment, task: task, created_by: user.internal_requester) }
  let(:user) { create(:printer_cloud_user) }
  let(:procedure) { create(:printer_flow_procedure, organization: user.organization) }
  let(:task) do
    create(:printer_flow_task, :started, procedure: procedure, assignee: user.internal_requester)
  end

  let!(:credentials) do
    { 'Authorization' => "Bearer #{user.token}",
      'X-Api-Subdomain' => user.organization.subdomain }
  end

  describe 'GET /v3/printer_flow/tasks/:task_id/task_comments' do
    it 'responds with status ok' do
      get "/v3/printer_flow/tasks/#{task.id}/task_comments", headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'renders a JSON with all task comments' do
      get "/v3/printer_flow/tasks/#{task.id}/task_comments", headers: credentials

      expect(JSON.parse(response.body)).to include(
        'printer_flow/task_comments' => [{
          'id' => task_comment.id,
          'body' => task_comment.body,
          'created_by_id' => task_comment.created_by_id,
          'task_id' => task_comment.task_id,
          'created_at' => task_comment.created_at.iso8601(3),
          'updated_at' => task_comment.updated_at.iso8601(3)
        }],
        'meta' => { 'total' => 1 }
      )
    end
  end

  describe 'GET /v3/printer_flow/tasks/:task_id/task_comments/:id' do
    it 'responds with status ok' do
      get "/v3/printer_flow/tasks/#{task.id}/task_comments/#{task_comment.id}", headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'renders a JSON with the task comment' do
      get "/v3/printer_flow/tasks/#{task.id}/task_comments/#{task_comment.id}", headers: credentials

      expect(JSON.parse(response.body)).to include(
        'id' => task_comment.id,
        'body' => task_comment.body,
        'created_by_id' => task_comment.created_by_id,
        'task_id' => task_comment.task_id,
        'created_by' => { 'id' => task_comment.created_by.id,
                          'name' => task_comment.created_by.name,
                          'code' => task_comment.created_by.code,
                          'cpf_cnpj' => task_comment.created_by.cpf_cnpj,
                          'type' => task_comment.created_by.type,
                          'birth_date' => task_comment.created_by.birth_date.to_s,
                          'email' => task_comment.created_by.email,
                          'optional_email' => task_comment.created_by.optional_email,
                          'phone' => task_comment.created_by.phone,
                          'optional_phone' => task_comment.created_by.optional_phone,
                          'occupation' => task_comment.created_by.occupation,
                          'organization_id' => task_comment.created_by.organization_id,
                          'parent_group_id' => task_comment.created_by.parent_group_id,
                          'prn' => task_comment.created_by.prn,
                          'status' => task_comment.created_by.status,
                          'blocked' => task_comment.created_by.blocked,
                          'created_at' => task_comment.created_by.created_at.iso8601(3),
                          'updated_at' => task_comment.created_by.updated_at.iso8601(3) },
        'task' => {
          'id' => task_comment.task.id,
          'name' => task_comment.task.name,
          'description' => task_comment.task.description,
          'group_assignee_id' => task_comment.task.group_assignee_id,
          'prn' => task_comment.task.prn,
          'deadline' => task_comment.task.deadline,
          'status' => task_comment.task.status,
          'task_template_id' => task_comment.task.task_template_id,
          'priority' => task_comment.task.priority,
          'procedure_id' => task_comment.task.procedure_id,
          'assignee_id' => task_comment.task.assignee_id,
          'created_at' => task_comment.task.created_at.iso8601(3),
          'updated_at' => task_comment.task.updated_at.iso8601(3),
          'created_by_id' => task_comment.task.created_by_id
        },
        'created_at' => task_comment.created_at.iso8601(3),
        'updated_at' => task_comment.updated_at.iso8601(3)
      )
    end
  end

  describe 'POST /v3/printer_flow/tasks/:task_id/task_comments' do
    let(:create_params) do
      { task_comment: { body: 'Protocolo' } }
    end

    it 'responds with status created' do
      post "/v3/printer_flow/tasks/#{task.id}/task_comments", params: create_params, headers: credentials

      expect(response).to have_http_status(:created)
    end

    it 'renders a JSON with the created task comment' do
      post "/v3/printer_flow/tasks/#{task.id}/task_comments", params: create_params, headers: credentials

      task_comment_id = JSON.parse(response.body)['id']
      task_comment = PrinterFlow::TaskComment.find(task_comment_id)

      expect(JSON.parse(response.body)).to include(
        'id' => task_comment.id,
        'body' => task_comment.body,
        'created_by_id' => task_comment.created_by_id,
        'task_id' => task_comment.task_id,
        'created_by' => { 'id' => task_comment.created_by.id,
                          'name' => task_comment.created_by.name,
                          'code' => task_comment.created_by.code,
                          'type' => task_comment.created_by.type,
                          'cpf_cnpj' => task_comment.created_by.cpf_cnpj,
                          'birth_date' => task_comment.created_by.birth_date.to_s,
                          'email' => task_comment.created_by.email,
                          'optional_email' => task_comment.created_by.optional_email,
                          'phone' => task_comment.created_by.phone,
                          'optional_phone' => task_comment.created_by.optional_phone,
                          'occupation' => task_comment.created_by.occupation,
                          'organization_id' => task_comment.created_by.organization_id,
                          'parent_group_id' => task_comment.created_by.parent_group_id,
                          'prn' => task_comment.created_by.prn,
                          'status' => task_comment.created_by.status,
                          'blocked' => task_comment.created_by.blocked,
                          'created_at' => task_comment.created_by.created_at.iso8601(3),
                          'updated_at' => task_comment.created_by.updated_at.iso8601(3) },
        'task' => {
          'id' => task_comment.task.id,
          'name' => task_comment.task.name,
          'description' => task_comment.task.description,
          'group_assignee_id' => task_comment.task.group_assignee_id,
          'prn' => task_comment.task.prn,
          'deadline' => task_comment.task.deadline,
          'status' => task_comment.task.status,
          'task_template_id' => task_comment.task.task_template_id,
          'priority' => task_comment.task.priority,
          'procedure_id' => task_comment.task.procedure_id,
          'assignee_id' => task_comment.task.assignee_id,
          'created_at' => task_comment.task.created_at.iso8601(3),
          'updated_at' => task_comment.task.updated_at.iso8601(3),
          'created_by_id' => task_comment.task.created_by_id
        },
        'created_at' => task_comment.created_at.iso8601(3),
        'updated_at' => task_comment.updated_at.iso8601(3)
      )
    end
  end

  describe 'PUT /v3/printer_flow/tasks/:task_id/task_comments' do
    let(:update_params) do
      { task_comment: { body: 'Protocolo' } }
    end

    it 'responds with status created' do
      put "/v3/printer_flow/tasks/#{task.id}/task_comments/#{task_comment.id}", params: update_params,
                                                                                headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'renders a JSON with the updated task comment' do
      put "/v3/printer_flow/tasks/#{task.id}/task_comments/#{task_comment.id}", params: update_params,
                                                                                headers: credentials

      task_comment.reload

      expect(JSON.parse(response.body)).to include(
        'id' => task_comment.id,
        'body' => task_comment.body,
        'created_by_id' => task_comment.created_by_id,
        'task_id' => task_comment.task_id,
        'created_by' => { 'id' => task_comment.created_by.id,
                          'name' => task_comment.created_by.name,
                          'code' => task_comment.created_by.code,
                          'type' => task_comment.created_by.type,
                          'cpf_cnpj' => task_comment.created_by.cpf_cnpj,
                          'birth_date' => task_comment.created_by.birth_date.to_s,
                          'email' => task_comment.created_by.email,
                          'optional_email' => task_comment.created_by.optional_email,
                          'phone' => task_comment.created_by.phone,
                          'optional_phone' => task_comment.created_by.optional_phone,
                          'occupation' => task_comment.created_by.occupation,
                          'organization_id' => task_comment.created_by.organization_id,
                          'parent_group_id' => task_comment.created_by.parent_group_id,
                          'prn' => task_comment.created_by.prn,
                          'status' => task_comment.created_by.status,
                          'blocked' => task_comment.created_by.blocked,
                          'created_at' => task_comment.created_by.created_at.iso8601(3),
                          'updated_at' => task_comment.created_by.updated_at.iso8601(3) },
        'task' => {
          'id' => task_comment.task.id,
          'name' => task_comment.task.name,
          'description' => task_comment.task.description,
          'group_assignee_id' => task_comment.task.group_assignee_id,
          'prn' => task_comment.task.prn,
          'deadline' => task_comment.task.deadline,
          'status' => task_comment.task.status,
          'task_template_id' => task_comment.task.task_template_id,
          'priority' => task_comment.task.priority,
          'procedure_id' => task_comment.task.procedure_id,
          'assignee_id' => task_comment.task.assignee_id,
          'created_at' => task_comment.task.created_at.iso8601(3),
          'updated_at' => task_comment.task.updated_at.iso8601(3),
          'created_by_id' => task_comment.task.created_by_id
        },
        'created_at' => task_comment.created_at.iso8601(3),
        'updated_at' => task_comment.updated_at.iso8601(3)
      )
    end
  end

  describe 'DELETE /v3/printer_flow/tasks/:task_id/task_comments/:id' do
    it 'responds with status ok' do
      delete "/v3/printer_flow/tasks/#{task.id}/task_comments/#{task_comment.id}", headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'renders a JSON with deleted task comment' do
      delete "/v3/printer_flow/tasks/#{task.id}/task_comments/#{task_comment.id}", headers: credentials

      expect(JSON.parse(response.body)).to include(
        'id' => task_comment.id,
        'body' => task_comment.body,
        'created_by_id' => task_comment.created_by_id,
        'task_id' => task_comment.task_id,
        'created_by' => { 'id' => task_comment.created_by.id,
                          'name' => task_comment.created_by.name,
                          'code' => task_comment.created_by.code,
                          'type' => task_comment.created_by.type,
                          'cpf_cnpj' => task_comment.created_by.cpf_cnpj,
                          'birth_date' => task_comment.created_by.birth_date.to_s,
                          'email' => task_comment.created_by.email,
                          'optional_email' => task_comment.created_by.optional_email,
                          'phone' => task_comment.created_by.phone,
                          'optional_phone' => task_comment.created_by.optional_phone,
                          'occupation' => task_comment.created_by.occupation,
                          'organization_id' => task_comment.created_by.organization_id,
                          'parent_group_id' => task_comment.created_by.parent_group_id,
                          'prn' => task_comment.created_by.prn,
                          'status' => task_comment.created_by.status,
                          'blocked' => task_comment.created_by.blocked,
                          'created_at' => task_comment.created_by.created_at.iso8601(3),
                          'updated_at' => task_comment.created_by.updated_at.iso8601(3) },
        'task' => {
          'id' => task_comment.task.id,
          'name' => task_comment.task.name,
          'description' => task_comment.task.description,
          'group_assignee_id' => task_comment.task.group_assignee_id,
          'prn' => task_comment.task.prn,
          'deadline' => task_comment.task.deadline,
          'status' => task_comment.task.status,
          'task_template_id' => task_comment.task.task_template_id,
          'priority' => task_comment.task.priority,
          'procedure_id' => task_comment.task.procedure_id,
          'assignee_id' => task_comment.task.assignee_id,
          'created_at' => task_comment.task.created_at.iso8601(3),
          'updated_at' => task_comment.task.updated_at.iso8601(3),
          'created_by_id' => task_comment.task.created_by_id
        },
        'created_at' => task_comment.created_at.iso8601(3),
        'updated_at' => task_comment.updated_at.iso8601(3)
      )
    end
  end
end
