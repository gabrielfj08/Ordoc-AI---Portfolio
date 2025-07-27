require 'rails_helper'

RSpec.describe 'PrinterFlow::TaskDocument', type: :request do
  let!(:task_document) { create(:task_document, task: task, created_by: user) }
  let(:user) { create(:printer_cloud_user) }
  let(:task) { create(:printer_flow_task, created_by: user) }

  let(:credentials) do
    { 'Authorization' => "Bearer #{user.token}",
      'X-Api-Subdomain' => user.organization.subdomain }
  end

  describe 'GET /v4/printer_flow/tasks/:task_id/task_documents' do
    it 'responds with status ok' do
      get '/v4/printer_flow/task_documents', headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'renders a JSON with all task documents' do
      get '/v4/printer_flow/task_documents', headers: credentials

      expect(JSON.parse(response.body)).to include(
        'printer_flow/task_documents' => [{
          'id' => task_document.id,
          'name' => task_document.name,
          'created_by_id' => task_document.created_by_id,
          's3_key' => task_document.s3_key,
          'key' => task_document.key,
          'source' => task_document.source,
          'status' => task_document.status,
          'task_id' => task_document.task_id,
          'document_id' => task_document.document_id,
          'uuid' => task_document.uuid,
          'signed_document_id' => task_document.signed_document_id,
          'created_at' => task_document.created_at.iso8601(3),
          'updated_at' => task_document.updated_at.iso8601(3)
        }],
        'meta' => { 'total' => 1 }
      )
    end
  end

  describe 'GET /v4/printer_flow/tasks/:task_id/task_documents/:id' do
    it 'responds with status ok' do
      get "/v4/printer_flow/tasks/#{task.id}/task_documents/#{task_document.id}", headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'renders a JSON with the task document' do
      get "/v4/printer_flow/tasks/#{task.id}/task_documents/#{task_document.id}", headers: credentials

      expect(JSON.parse(response.body)).to include(
        'id' => task_document.id,
        'name' => task_document.name,
        'created_by_id' => task_document.created_by_id,
        's3_key' => task_document.s3_key,
        'key' => task_document.key,
        'source' => task_document.source,
        'status' => task_document.status,
        'task_id' => task_document.task_id,
        'document_id' => task_document.document_id,
        'uuid' => task_document.uuid,
        'signed_document_id' => task_document.signed_document_id,
        'created_at' => task_document.created_at.iso8601(3),
        'updated_at' => task_document.updated_at.iso8601(3)
      )
    end
  end

  describe 'POST /v4/printer_flow/tasks/:task_id/task_documents' do
    let(:create_params) do
      {
        task_document: {
          name: 'Protocolo',
          source: 'upload',
          key: task_document.key
        }
      }
    end

    it 'responds with status created' do
      post "/v4/printer_flow/tasks/#{task.id}/task_documents", params: create_params, headers: credentials

      expect(response).to have_http_status(:created)
    end

    it 'renders a JSON with the created procedure template' do
      post "/v4/printer_flow/tasks/#{task.id}/task_documents", params: create_params, headers: credentials

      task_document_id = JSON.parse(response.body)['id']
      task_document = PrinterFlow::TaskDocument.find(task_document_id)

      expect(JSON.parse(response.body)).to include(
        'id' => task_document.id,
        'name' => task_document.name,
        'created_by_id' => task_document.created_by_id,
        's3_key' => task_document.s3_key,
        'key' => task_document.key,
        'source' => task_document.source,
        'status' => task_document.status,
        'task_id' => task_document.task_id,
        'document_id' => task_document.document_id,
        'uuid' => task_document.uuid,
        'signed_document_id' => task_document.signed_document_id,
        'created_at' => task_document.created_at.iso8601(3),
        'updated_at' => task_document.updated_at.iso8601(3)
      )
    end
  end

  describe 'DELETE /v4/printer_flow/tasks/:task_id/task_documents/:id' do
    it 'responds with status ok' do
      delete "/v4/printer_flow/tasks/#{task.id}/task_documents/#{task_document.id}", headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'renders a JSON with updated procedure template' do
      delete "/v4/printer_flow/tasks/#{task.id}/task_documents/#{task_document.id}", headers: credentials

      expect(JSON.parse(response.body)).to include(
        'id' => task_document.id,
        'name' => task_document.name,
        'created_by_id' => task_document.created_by_id,
        's3_key' => task_document.s3_key,
        'key' => task_document.key,
        'source' => task_document.source,
        'status' => task_document.status,
        'task_id' => task_document.task_id,
        'document_id' => task_document.document_id,
        'uuid' => task_document.uuid,
        'signed_document_id' => task_document.signed_document_id,
        'created_at' => task_document.created_at.iso8601(3),
        'updated_at' => task_document.updated_at.iso8601(3)
      )
    end
  end
end
