require 'rails_helper'

RSpec.describe 'PrinterFlow::TaskComment', type: :request do
  let!(:task_comment) { create(:task_comment, task: task, created_by: requester) }
  let(:requester) { create(:external_requester) }
  let(:procedure) { create(:printer_flow_procedure, requester: requester, organization: requester.organization) }
  let(:task) { create(:printer_flow_task, :started, procedure: procedure, assignee: requester) }

  let!(:credentials) do
    { 'Authorization' => "Bearer #{requester.token}",
      'X-Api-Subdomain' => requester.organization.subdomain }
  end

  describe 'GET /v3/printer_flow/external/tasks/:task_id/task_comments' do
    it 'responds with status ok' do
      get "/v3/printer_flow/external/tasks/#{task.id}/task_comments", headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'renders a JSON with all task comments' do
      get "/v3/printer_flow/external/tasks/#{task.id}/task_comments", headers: credentials

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

  describe 'GET /v3/printer_flow/external/tasks/:task_id/task_comments/:id' do
    it 'responds with status ok' do
      get "/v3/printer_flow/external/tasks/#{task.id}/task_comments/#{task_comment.id}", headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'renders a JSON with the task comment' do
      get "/v3/printer_flow/external/tasks/#{task.id}/task_comments/#{task_comment.id}", headers: credentials

      expect(JSON.parse(response.body)).to include(
        'id' => task_comment.id,
        'body' => task_comment.body,
        'created_by_id' => task_comment.created_by_id,
        'task_id' => task_comment.task_id,
        'created_at' => task_comment.created_at.iso8601(3),
        'updated_at' => task_comment.updated_at.iso8601(3),
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
                          'updated_at' => task_comment.created_by.updated_at.iso8601(3) }
      )
    end
  end

  describe 'POST /v3/printer_flow/external/tasks/:task_id/task_comments' do
    let(:create_params) do
      { task_comment: { body: 'Assine com caneta azul' } }
    end

    it 'responds with status created' do
      post "/v3/printer_flow/external/tasks/#{task.id}/task_comments", params: create_params, headers: credentials

      expect(response).to have_http_status(:created)
    end

    it 'renders a JSON with the created task comment' do
      post "/v3/printer_flow/external/tasks/#{task.id}/task_comments", params: create_params, headers: credentials

      task_comment_id = JSON.parse(response.body)['id']
      task_comment = PrinterFlow::TaskComment.find(task_comment_id)

      expect(JSON.parse(response.body)).to include(
        'id' => task_comment.id,
        'body' => task_comment.body,
        'created_by_id' => task_comment.created_by_id,
        'task_id' => task_comment.task_id,
        'created_at' => task_comment.created_at.iso8601(3),
        'updated_at' => task_comment.updated_at.iso8601(3),
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
                          'updated_at' => task_comment.created_by.updated_at.iso8601(3) }
      )
    end
  end

  describe 'PUT /v3/printer_flow/external/tasks/:task_id/task_comments/:id' do
    let(:update_params) do
      { task_comment: { body: 'Assine com caneta preta, por favor.' } }
    end

    it 'responds with status ok' do
      put "/v3/printer_flow/external/tasks/#{task.id}/task_comments/#{task_comment.id}", params: update_params,
                                                                                         headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'renders a JSON with the created task comment' do
      put "/v3/printer_flow/external/tasks/#{task.id}/task_comments/#{task_comment.id}", params: update_params,
                                                                                         headers: credentials

      task_comment.reload

      expect(JSON.parse(response.body)).to include(
        'id' => task_comment.id,
        'body' => task_comment.body,
        'created_by_id' => task_comment.created_by_id,
        'task_id' => task_comment.task_id,
        'created_at' => task_comment.created_at.iso8601(3),
        'updated_at' => task_comment.updated_at.iso8601(3),
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
                          'updated_at' => task_comment.created_by.updated_at.iso8601(3) }
      )
    end
  end

  describe 'DELETE /v3/printer_flow/external/tasks/:task_id/task_comments/:id' do
    it 'responds with status ok' do
      delete "/v3/printer_flow/external/tasks/#{task.id}/task_comments/#{task_comment.id}", headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'renders a JSON with deleted task comment' do
      delete "/v3/printer_flow/external/tasks/#{task.id}/task_comments/#{task_comment.id}", headers: credentials

      expect(JSON.parse(response.body)).to include(
        'id' => task_comment.id,
        'body' => task_comment.body,
        'created_by_id' => task_comment.created_by_id,
        'task_id' => task_comment.task_id,
        'created_at' => task_comment.created_at.iso8601(3),
        'updated_at' => task_comment.updated_at.iso8601(3),
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
                          'updated_at' => task_comment.created_by.updated_at.iso8601(3) }
      )
    end
  end
end
