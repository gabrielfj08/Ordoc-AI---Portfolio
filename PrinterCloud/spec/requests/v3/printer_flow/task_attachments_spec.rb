require 'rails_helper'

RSpec.describe 'PrinterFlow::TaskAttachment', type: :request do
  let!(:task_attachment) { create(:printer_flow_task_attachment, created_by: user.internal_requester) }
  let(:user) { create(:printer_cloud_user) }
  let(:task) { create(:printer_flow_task, :draft, created_by: user) }

  let(:credentials) do
    { 'Authorization' => "Bearer #{user.token}",
      'X-Api-Subdomain' => user.organization.subdomain }
  end

  describe 'GET /v3/printer_flow/task_attachments' do
    it 'responds with status ok' do
      get '/v3/printer_flow/task_attachments', headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'renders a JSON with all attachments' do
      get '/v3/printer_flow/task_attachments', headers: credentials

      expect(JSON.parse(response.body)).to include(
        'printer_flow/task_attachments' => [{
          'id' => task_attachment.id,
          'attachable_id' => task_attachment.attachable_id,
          'attachable_type' => task_attachment.attachable_type.demodulize.underscore,
          'task_id' => task_attachment.task_id,
          'created_by_id' => user.internal_requester.id,
          'attachable' => {
            'id' => task_attachment.attachable.id,
            'name' => task_attachment.attachable.name,
            'created_by_id' => task_attachment.attachable.created_by_id,
            'uuid' => task_attachment.attachable.uuid,
            's3_key' => task_attachment.attachable.s3_key,
            'status' => task_attachment.attachable.status,
            'procedure_id' => task_attachment.attachable.procedure_id,
            'document_id' => task_attachment.attachable.document_id,
            'document_url' => task_attachment.attachable.document_url,
            'signed_document_id' => task_attachment.attachable.signed_document_id,
            'created_at' => task_attachment.attachable.created_at.iso8601(3),
            'updated_at' => task_attachment.attachable.updated_at.iso8601(3)
          },
          'created_at' => task_attachment.created_at.iso8601(3),
          'updated_at' => task_attachment.updated_at.iso8601(3)
        }],
        'meta' => {
          'total' => 1
        }
      )
    end
  end

  describe 'GET /v3/printer_flow/task_attachments/:id' do
    it 'responds with status ok' do
      get "/v3/printer_flow/task_attachments/#{task_attachment.id}", headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'renders a JSON with the attachment' do
      get "/v3/printer_flow/task_attachments/#{task_attachment.id}", headers: credentials

      expect(JSON.parse(response.body)).to include(
        {
          'id' => task_attachment.id,
          'attachable_id' => task_attachment.attachable_id,
          'attachable_type' => task_attachment.attachable_type.demodulize.underscore,
          'task_id' => task_attachment.task_id,
          'created_by_id' => task_attachment.created_by.id,
          'created_at' => task_attachment.created_at.iso8601(3),
          'updated_at' => task_attachment.updated_at.iso8601(3),
          'created_by' => {
            'id' => task_attachment.created_by.id,
            'name' => task_attachment.created_by.name,
            'organization_id' => task_attachment.created_by.organization_id,
            'parent_group_id' => nil,
            'prn' => task_attachment.created_by.prn,
            'email' => task_attachment.created_by.email,
            'type' => task_attachment.created_by.type,
            'cpf_cnpj' => task_attachment.created_by.cpf_cnpj,
            'code' => task_attachment.created_by.code,
            'status' => task_attachment.created_by.status,
            'blocked' => task_attachment.created_by.blocked,
            'birth_date' => task_attachment.created_by.birth_date.to_s,
            'phone' => task_attachment.created_by.phone,
            'optional_email' => task_attachment.created_by.optional_email,
            'optional_phone' => task_attachment.created_by.optional_phone,
            'occupation' => task_attachment.created_by.occupation,
            'created_at' => task_attachment.created_by.created_at.iso8601(3),
            'updated_at' => task_attachment.created_by.updated_at.iso8601(3)
          },
          'attachable' => {
            'id' => task_attachment.attachable.id,
            'name' => task_attachment.attachable.name,
            'created_by_id' => task_attachment.attachable.created_by_id,
            'uuid' => task_attachment.attachable.uuid,
            's3_key' => task_attachment.attachable.s3_key,
            'status' => task_attachment.attachable.status,
            'procedure_id' => task_attachment.attachable.procedure_id,
            'document_id' => task_attachment.attachable.document_id,
            'document_url' => task_attachment.attachable.document_url,
            'signed_document_id' => task_attachment.attachable.signed_document_id,
            'created_at' => task_attachment.attachable.created_at.iso8601(3),
            'updated_at' => task_attachment.attachable.updated_at.iso8601(3)
          }
        }
      )
    end
  end

  describe 'POST /v3/printer_flow/task_attachments' do
    let(:task_document) { create(:task_document, task: task) }
    let(:create_params) do
      { task_id: task.id,
        task_document_ids: [task_document.id] }
    end

    it 'responds with status ok' do
      post '/v3/printer_flow/task_attachments', params: create_params, headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'renders a JSON with the created attachment' do
      post '/v3/printer_flow/task_attachments', params: create_params, headers: credentials

      batch_operation_id = JSON.parse(response.body)['id']
      batch_operation = ::PrinterAir::BatchOperation.find(batch_operation_id)

      expect(JSON.parse(response.body)).to include(
        'id' => batch_operation.id,
        'ids' =>
          [task.id],
        'payload' => {
          'procedure_document_ids' => nil,
          'task_document_ids' => [task_document.id.to_s]
        },
        'action' => batch_operation.action,
        'record_type' => 'PrinterFlow::TaskAttachment',
        'created_by_id' => user.id,
        'status' => batch_operation.status,
        'created_at' => batch_operation.created_at.iso8601(3),
        'updated_at' => batch_operation.updated_at.iso8601(3)
      )
    end
  end

  describe 'DELETE /v3/printer_flow/task_attachments/:id' do
    let(:task_attachment) { create(:printer_flow_task_attachment, task: task, created_by: user.internal_requester) }

    it 'responds with status ok' do
      delete "/v3/printer_flow/task_attachments/#{task_attachment.id}", headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'renders a JSON with the deleted attachment' do
      delete "/v3/printer_flow/task_attachments/#{task_attachment.id}", headers: credentials

      expect(JSON.parse(response.body)).to include(
        {
          'id' => task_attachment.id,
          'attachable_id' => task_attachment.attachable_id,
          'attachable_type' => task_attachment.attachable_type.demodulize.underscore,
          'task_id' => task_attachment.task_id,
          'created_by_id' => user.internal_requester.id,
          'created_at' => task_attachment.created_at.iso8601(3),
          'updated_at' => task_attachment.updated_at.iso8601(3),
          'created_by' => {
            'id' => task_attachment.created_by.id,
            'name' => task_attachment.created_by.name,
            'organization_id' => task_attachment.created_by.organization_id,
            'parent_group_id' => nil,
            'prn' => task_attachment.created_by.prn,
            'email' => task_attachment.created_by.email,
            'type' => task_attachment.created_by.type,
            'cpf_cnpj' => task_attachment.created_by.cpf_cnpj,
            'code' => task_attachment.created_by.code,
            'status' => task_attachment.created_by.status,
            'blocked' => task_attachment.created_by.blocked,
            'birth_date' => task_attachment.created_by.birth_date.to_s,
            'phone' => task_attachment.created_by.phone,
            'optional_email' => task_attachment.created_by.optional_email,
            'optional_phone' => task_attachment.created_by.optional_phone,
            'occupation' => task_attachment.created_by.occupation,
            'created_at' => task_attachment.created_by.created_at.iso8601(3),
            'updated_at' => task_attachment.created_by.updated_at.iso8601(3)
          },
          'attachable' => {
            'id' => task_attachment.attachable.id,
            'name' => task_attachment.attachable.name,
            'created_by_id' => task_attachment.attachable.created_by_id,
            'uuid' => task_attachment.attachable.uuid,
            's3_key' => task_attachment.attachable.s3_key,
            'status' => task_attachment.attachable.status,
            'procedure_id' => task_attachment.attachable.procedure_id,
            'document_id' => task_attachment.attachable.document_id,
            'document_url' => task_attachment.attachable.document_url,
            'signed_document_id' => task_attachment.attachable.signed_document_id,
            'created_at' => task_attachment.attachable.created_at.iso8601(3),
            'updated_at' => task_attachment.attachable.updated_at.iso8601(3)
          }
        }
      )
    end
  end
end
