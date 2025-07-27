require 'rails_helper'

RSpec.describe 'PrinterFlow::TaskDocument', type: :request do
  let!(:stub_env) { stub_const('ENV', 'EXTERNAL_USER_ID' => task_document.created_by_id) }
  let!(:task_document) { create(:task_document, task: task) }
  let(:requester) { create(:external_requester) }
  let(:procedure) do
    create(:printer_flow_procedure, :external, organization: requester.organization, requester: requester)
  end
  let(:task) { create(:printer_flow_task, procedure: procedure, assignee: requester, group_assignee: requester) }

  let!(:credentials) do
    { 'Authorization' => "Bearer #{requester.token}",
      'X-Api-Subdomain' => requester.organization.subdomain }
  end

  describe 'GET /v3/printer_flow/external/tasks/task_documents' do
    it 'responds with status ok' do
      get '/v3/printer_flow/external/task_documents', headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'renders a JSON with all task documents' do
      get '/v3/printer_flow/external/task_documents', headers: credentials

      expect(JSON.parse(response.body)).to include(
        'printer_flow/task_documents' => [{
          'id' => task_document.id,
          'name' => task_document.name,
          'created_by_id' => task_document.created_by_id,
          's3_key' => task_document.s3_key,
          'status' => task_document.status,
          'task_id' => task_document.task_id,
          'document_id' => task_document.document_id,
          'uuid' => task_document.uuid,
          'signed_document_id' => task_document.signed_document_id,
          'created_at' => task_document.created_at.iso8601(3),
          'updated_at' => task_document.updated_at.iso8601(3),
          'created_by' => { 'id' => task_document.created_by.id,
                            'name' => task_document.created_by.name,
                            'email' => task_document.created_by.email,
                            'cpf' => task_document.created_by.cpf,
                            'date_of_birth' => task_document.created_by.date_of_birth.to_s,
                            'avatar_url' => task_document.created_by.avatar_url,
                            'organization_id' => task_document.created_by.organization_id,
                            'phone' => task_document.created_by.phone,
                            'prn' => task_document.created_by.prn,
                            'status' => task_document.created_by.status,
                            'username' => task_document.created_by.username,
                            'changed_password' => task_document.created_by.changed_password,
                            'registration_number' => task_document.created_by.registration_number,
                            'created_at' => task_document.created_by.created_at.iso8601(3),
                            'updated_at' => task_document.created_by.updated_at.iso8601(3),
                            'deleted_at' => task_document.created_by.deleted_at }
        }],
        'meta' => { 'total' => 1 }
      )
    end
  end

  describe 'GET /v3/printer_flow/external/tasks/:task_id/task_documents/:id' do
    it 'responds with status ok' do
      get "/v3/printer_flow/external/tasks/#{task.id}/task_documents/#{task_document.id}", headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'renders a JSON with the task document' do
      get "/v3/printer_flow/external/tasks/#{task.id}/task_documents/#{task_document.id}", headers: credentials

      expect(JSON.parse(response.body)).to include(
        'id' => task_document.id,
        'name' => task_document.name,
        'created_by_id' => task_document.created_by_id,
        's3_key' => task_document.s3_key,
        'status' => task_document.status,
        'task_id' => task_document.task_id,
        'document_id' => task_document.document_id,
        'uuid' => task_document.uuid,
        'signed_document_id' => task_document.signed_document_id,
        'created_at' => task_document.created_at.iso8601(3),
        'updated_at' => task_document.updated_at.iso8601(3),
        'created_by' => { 'id' => task_document.created_by.id,
                          'name' => task_document.created_by.name,
                          'email' => task_document.created_by.email,
                          'cpf' => task_document.created_by.cpf,
                          'date_of_birth' => task_document.created_by.date_of_birth.to_s,
                          'avatar_url' => task_document.created_by.avatar_url,
                          'organization_id' => task_document.created_by.organization_id,
                          'phone' => task_document.created_by.phone,
                          'prn' => task_document.created_by.prn,
                          'status' => task_document.created_by.status,
                          'username' => task_document.created_by.username,
                          'changed_password' => task_document.created_by.changed_password,
                          'registration_number' => task_document.created_by.registration_number,
                          'created_at' => task_document.created_by.created_at.iso8601(3),
                          'updated_at' => task_document.created_by.updated_at.iso8601(3),
                          'deleted_at' => task_document.created_by.deleted_at }
      )
    end
  end

  describe 'POST /v3/printer_flow/external/tasks/:task_id/task_documents' do
    let(:create_params) do
      {
        task_document: {
          name: 'Protocolo',
          s3_key: task_document.s3_key
        }
      }
    end

    it 'responds with status created' do
      post "/v3/printer_flow/external/tasks/#{task.id}/task_documents", params: create_params, headers: credentials

      expect(response).to have_http_status(:created)
    end

    it 'renders a JSON with the created task document' do
      post "/v3/printer_flow/external/tasks/#{task.id}/task_documents", params: create_params, headers: credentials

      task_document_id = JSON.parse(response.body)['id']
      task_document = PrinterFlow::TaskDocument.find(task_document_id)

      expect(JSON.parse(response.body)).to include(
        'id' => task_document.id,
        'name' => task_document.name,
        'created_by_id' => task_document.created_by_id,
        's3_key' => task_document.s3_key,
        'status' => task_document.status,
        'task_id' => task_document.task_id,
        'document_id' => task_document.document_id,
        'uuid' => task_document.uuid,
        'signed_document_id' => task_document.signed_document_id,
        'created_at' => task_document.created_at.iso8601(3),
        'updated_at' => task_document.updated_at.iso8601(3),
        'created_by' => { 'id' => task_document.created_by.id,
                          'name' => task_document.created_by.name,
                          'email' => task_document.created_by.email,
                          'cpf' => task_document.created_by.cpf,
                          'date_of_birth' => task_document.created_by.date_of_birth.to_s,
                          'avatar_url' => task_document.created_by.avatar_url,
                          'organization_id' => task_document.created_by.organization_id,
                          'phone' => task_document.created_by.phone,
                          'prn' => task_document.created_by.prn,
                          'status' => task_document.created_by.status,
                          'username' => task_document.created_by.username,
                          'changed_password' => task_document.created_by.changed_password,
                          'registration_number' => task_document.created_by.registration_number,
                          'created_at' => task_document.created_by.created_at.iso8601(3),
                          'updated_at' => task_document.created_by.updated_at.iso8601(3),
                          'deleted_at' => task_document.created_by.deleted_at }
      )
    end
  end

  describe 'DELETE /v3/printer_flow/external/tasks/:task_id/task_documents/:id' do
    it 'responds with status ok' do
      delete "/v3/printer_flow/external/tasks/#{task.id}/task_documents/#{task_document.id}", headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'renders a JSON with updated task document' do
      delete "/v3/printer_flow/external/tasks/#{task.id}/task_documents/#{task_document.id}", headers: credentials

      expect(JSON.parse(response.body)).to include(
        'id' => task_document.id,
        'name' => task_document.name,
        'created_by_id' => task_document.created_by_id,
        's3_key' => task_document.s3_key,
        'status' => task_document.status,
        'task_id' => task_document.task_id,
        'document_id' => task_document.document_id,
        'uuid' => task_document.uuid,
        'signed_document_id' => task_document.signed_document_id,
        'created_at' => task_document.created_at.iso8601(3),
        'updated_at' => task_document.updated_at.iso8601(3),
        'created_by' => { 'id' => task_document.created_by.id,
                          'name' => task_document.created_by.name,
                          'email' => task_document.created_by.email,
                          'cpf' => task_document.created_by.cpf,
                          'date_of_birth' => task_document.created_by.date_of_birth.to_s,
                          'avatar_url' => task_document.created_by.avatar_url,
                          'organization_id' => task_document.created_by.organization_id,
                          'phone' => task_document.created_by.phone,
                          'prn' => task_document.created_by.prn,
                          'status' => task_document.created_by.status,
                          'username' => task_document.created_by.username,
                          'changed_password' => task_document.created_by.changed_password,
                          'registration_number' => task_document.created_by.registration_number,
                          'created_at' => task_document.created_by.created_at.iso8601(3),
                          'updated_at' => task_document.created_by.updated_at.iso8601(3),
                          'deleted_at' => task_document.created_by.deleted_at }
      )
    end
  end
end
