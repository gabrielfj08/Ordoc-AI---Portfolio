require 'rails_helper'

RSpec.describe 'PrinterSign::Signature', type: :request do
  let!(:signature) { create(:signature, requester: user.internal_requester, created_by: user) }
  let(:user) { create(:printer_cloud_user) }

  let(:credentials) do
    { 'Authorization' => "Bearer #{user.token}",
      'X-Api-Subdomain' => user.organization.subdomain }
  end

  describe 'GET /v3/printer_flow/signatures' do
    it 'responds with status ok' do
      get '/v3/printer_flow/signatures', headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'renders a JSON with all signatures' do
      get '/v3/printer_flow/signatures', headers: credentials

      expect(JSON.parse(response.body)).to include(
        'printer_sign/signatures' => [{
          'id' => signature.id,
          'signable_id' => signature.signable_id,
          'signable_type' => signature.signable_type,
          'status' => signature.status,
          'service' => signature.service,
          'requester_id' => signature.requester_id,
          'created_by_id' => signature.created_by_id,
          'procedure_id' => signature.procedure_id,
          'procedure' => {
            'id' => signature.procedure.id,
            'deadline' => signature.procedure.deadline.to_s,
            'priority' => signature.procedure.priority,
            'private' => signature.procedure.private,
            'prn' => signature.procedure.prn,
            'organization_id' => signature.procedure.organization_id,
            'process_number' => signature.procedure.process_number,
            'responsible_group_id' => signature.procedure.responsible_group_id,
            'requester_id' => signature.procedure.requester_id,
            'created_by_id' => signature.procedure.created_by_id,
            'procedure_template_name' => signature.procedure.procedure_template_name,
            'procedure_template_id' => signature.procedure.procedure_template_id,
            'source' => signature.procedure.source,
            'status' => signature.procedure.status,
            'schema' => signature.procedure.schema,
            'payload' => signature.procedure.payload,
            'created_at' => signature.procedure.created_at.iso8601(3),
            'updated_at' => signature.procedure.updated_at.iso8601(3)
          },
          'signable' => {
            'id' => signature.signable.id,
            'name' => signature.signable.name,
            'created_by_id' => signature.signable.created_by_id,
            'uuid' => signature.signable.uuid,
            's3_key' => signature.signable.s3_key,
            'status' => signature.signable.status,
            'procedure_id' => signature.signable.procedure_id,
            'document_id' => signature.signable.document_id,
            'document_url' => signature.signable.document_url,
            'signed_document_id' => signature.signable.signed_document_id,
            'created_at' => signature.signable.created_at.iso8601(3),
            'updated_at' => signature.signable.updated_at.iso8601(3)
          },
          'requester' => {
            'id' => signature.requester.id,
            'name' => signature.requester.name,
            'organization_id' => signature.requester.organization_id,
            'parent_group_id' => nil,
            'prn' => signature.requester.prn,
            'email' => signature.requester.email,
            'type' => signature.requester.type,
            'cpf_cnpj' => signature.requester.cpf_cnpj,
            'code' => signature.requester.code,
            'status' => signature.requester.status,
            'blocked' => signature.requester.blocked,
            'birth_date' => signature.requester.birth_date.to_s,
            'phone' => signature.requester.phone,
            'optional_email' => signature.requester.optional_email,
            'optional_phone' => signature.requester.optional_phone,
            'occupation' => signature.requester.occupation,
            'created_at' => signature.requester.created_at.iso8601(3),
            'updated_at' => signature.requester.updated_at.iso8601(3)
          },
          'created_by' => {
            'avatar_url' => signature.created_by.avatar_url,
            'changed_password' => signature.created_by.changed_password,
            'cpf' => signature.created_by.cpf,
            'created_at' => signature.created_by.created_at.iso8601(3),
            'updated_at' => signature.created_by.updated_at.iso8601(3),
            'deleted_at' => nil,
            'date_of_birth' => signature.created_by.date_of_birth.strftime('%Y-%m-%d'),
            'email' => signature.created_by.email,
            'id' => signature.created_by.id,
            'name' => signature.created_by.name,
            'organization_id' => signature.created_by.organization_id,
            'phone' => signature.created_by.phone,
            'prn' => signature.created_by.prn,
            'status' => signature.created_by.status,
            'username' => signature.created_by.username,
            'registration_number' => nil
          },
          'token' => signature.token,
          'created_at' => signature.created_at.iso8601(3),
          'updated_at' => signature.updated_at.iso8601(3)
        }],
        'meta' => {
          'total' => 1
        }
      )
    end
  end

  describe 'GET /v3/printer_flow/signatures/:id' do
    it 'responds with status ok' do
      get "/v3/printer_flow/signatures/#{signature.id}", headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'renders a JSON with all signatures' do
      get "/v3/printer_flow/signatures/#{signature.id}", headers: credentials

      expect(JSON.parse(response.body)).to include(
        {
          'id' => signature.id,
          'signable_id' => signature.signable_id,
          'signable_type' => signature.signable_type,
          'status' => signature.status,
          'service' => signature.service,
          'requester_id' => signature.requester_id,
          'created_by_id' => signature.created_by_id,
          'procedure_id' => signature.procedure_id,
          'token' => signature.token,
          'created_at' => signature.created_at.iso8601(3),
          'updated_at' => signature.updated_at.iso8601(3),
          'requester' => { 'id' => signature.requester.id,
                           'name' => signature.requester.name,
                           'organization_id' => signature.requester.organization_id,
                           'parent_group_id' => nil,
                           'prn' => signature.requester.prn,
                           'email' => signature.requester.email,
                           'type' => signature.requester.type,
                           'cpf_cnpj' => signature.requester.cpf_cnpj,
                           'code' => signature.requester.code,
                           'status' => signature.requester.status,
                           'blocked' => signature.requester.blocked,
                           'birth_date' => signature.requester.birth_date.to_s,
                           'phone' => signature.requester.phone,
                           'optional_email' => signature.requester.optional_email,
                           'optional_phone' => signature.requester.optional_phone,
                           'occupation' => signature.requester.occupation,
                           'created_at' => signature.requester.created_at.iso8601(3),
                           'updated_at' => signature.requester.updated_at.iso8601(3) },
          'signable' => {
            'id' => signature.signable.id,
            'name' => signature.signable.name,
            'created_by_id' => signature.signable.created_by_id,
            'uuid' => signature.signable.uuid,
            's3_key' => signature.signable.s3_key,
            'status' => signature.signable.status,
            'procedure_id' => signature.signable.procedure_id,
            'document_id' => signature.signable.document_id,
            'document_url' => signature.signable.document_url,
            'signed_document_id' => nil,
            'created_at' => signature.signable.created_at.iso8601(3),
            'updated_at' => signature.signable.updated_at.iso8601(3)
          }
        }
      )
    end
  end

  describe 'POST /v3/printer_flow/signatures' do
    let(:procedure_document) { create(:procedure_document, organization: user.organization, created_by: user) }
    let(:params) do
      {
        requester_ids: [user.internal_requester.id],
        procedure_document_ids: [procedure_document.id]
      }
    end

    it 'responds with status ok' do
      post '/v3/printer_flow/signatures', headers: credentials, params: params

      expect(response).to have_http_status(:ok)
    end

    it 'renders a JSON with a batch operation, returning requesting signatures' do
      post '/v3/printer_flow/signatures', headers: credentials, params: params

      batch_operation_id = JSON.parse(response.body)['id']
      batch_operation = ::PrinterAir::BatchOperation.find(batch_operation_id)

      expect(JSON.parse(response.body)).to include(
        'id' => batch_operation.id,
        'ids' => [
          user.internal_requester.id
        ],
        'payload' => {
          'procedure_document_ids' => [procedure_document.id.to_s],
          'task_document_ids' => nil
        },
        'action' => batch_operation.action,
        'record_type' => 'PrinterSign::Signature',
        'created_by_id' => user.id,
        'status' => batch_operation.status,
        'created_at' => batch_operation.created_at.iso8601(3),
        'updated_at' => batch_operation.updated_at.iso8601(3)
      )
    end
  end

  describe 'PUT /v3/printer_flow/signatures/:id/sign' do
    it 'responds with status ok' do
      put "/v3/printer_flow/signatures/#{signature.id}/sign", headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'renders a JSON with a signed signatures' do
      put "/v3/printer_flow/signatures/#{signature.id}/sign", headers: credentials

      signature.reload

      expect(JSON.parse(response.body)).to include(
        {
          'id' => signature.id,
          'signable_id' => signature.signable_id,
          'signable_type' => signature.signable_type,
          'status' => signature.status,
          'service' => signature.service,
          'requester_id' => signature.requester_id,
          'created_by_id' => signature.created_by_id,
          'procedure_id' => signature.procedure_id,
          'token' => signature.token,
          'created_at' => signature.created_at.iso8601(3),
          'updated_at' => signature.updated_at.iso8601(3),
          'requester' => { 'id' => signature.requester.id,
                           'name' => signature.requester.name,
                           'organization_id' => signature.requester.organization_id,
                           'parent_group_id' => nil,
                           'prn' => signature.requester.prn,
                           'email' => signature.requester.email,
                           'type' => signature.requester.type,
                           'cpf_cnpj' => signature.requester.cpf_cnpj,
                           'code' => signature.requester.code,
                           'status' => signature.requester.status,
                           'blocked' => signature.requester.blocked,
                           'birth_date' => signature.requester.birth_date.to_s,
                           'phone' => signature.requester.phone,
                           'optional_email' => signature.requester.optional_email,
                           'optional_phone' => signature.requester.optional_phone,
                           'occupation' => signature.requester.occupation,
                           'created_at' => signature.requester.created_at.iso8601(3),
                           'updated_at' => signature.requester.updated_at.iso8601(3) }
        }
      )
    end
  end

  describe 'PUT /v3/printer_flow/signatures/:id/refuse' do
    let(:refuse_params) do
      {
        note: 'tarefa esta incompleta'
      }
    end
    it 'responds with status ok' do
      put "/v3/printer_flow/signatures/#{signature.id}/refuse", headers: credentials, params: refuse_params

      expect(response).to have_http_status(:ok)
    end

    it 'renders a JSON with a refused signature' do
      put "/v3/printer_flow/signatures/#{signature.id}/refuse", headers: credentials, params: refuse_params

      signature.reload

      expect(JSON.parse(response.body)).to include(
        {
          'id' => signature.id,
          'signable_id' => signature.signable_id,
          'signable_type' => signature.signable_type,
          'status' => signature.status,
          'service' => signature.service,
          'requester_id' => signature.requester_id,
          'created_by_id' => signature.created_by_id,
          'procedure_id' => signature.procedure_id,
          'token' => signature.token,
          'created_at' => signature.created_at.iso8601(3),
          'updated_at' => signature.updated_at.iso8601(3),
          'requester' => { 'id' => signature.requester.id,
                           'name' => signature.requester.name,
                           'organization_id' => signature.requester.organization_id,
                           'parent_group_id' => nil,
                           'prn' => signature.requester.prn,
                           'email' => signature.requester.email,
                           'type' => signature.requester.type,
                           'cpf_cnpj' => signature.requester.cpf_cnpj,
                           'code' => signature.requester.code,
                           'status' => signature.requester.status,
                           'blocked' => signature.requester.blocked,
                           'birth_date' => signature.requester.birth_date.to_s,
                           'phone' => signature.requester.phone,
                           'optional_email' => signature.requester.optional_email,
                           'optional_phone' => signature.requester.optional_phone,
                           'occupation' => signature.requester.occupation,
                           'created_at' => signature.requester.created_at.iso8601(3),
                           'updated_at' => signature.requester.updated_at.iso8601(3) }
        }
      )
    end
  end

  describe 'DELETE /v3/printer_flow/signatures/:id' do
    it 'responds with status ok' do
      delete "/v3/printer_flow/signatures/#{signature.id}", headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'renders a JSON with all signatures' do
      delete "/v3/printer_flow/signatures/#{signature.id}", headers: credentials

      expect(JSON.parse(response.body)).to include(
        {
          'id' => signature.id,
          'signable_id' => signature.signable_id,
          'signable_type' => signature.signable_type,
          'status' => signature.status,
          'service' => signature.service,
          'requester_id' => signature.requester_id,
          'created_by_id' => signature.created_by_id,
          'procedure_id' => signature.procedure_id,
          'token' => signature.token,
          'created_at' => signature.created_at.iso8601(3),
          'updated_at' => signature.updated_at.iso8601(3),
          'requester' => { 'id' => signature.requester.id,
                           'name' => signature.requester.name,
                           'organization_id' => signature.requester.organization_id,
                           'parent_group_id' => nil,
                           'prn' => signature.requester.prn,
                           'email' => signature.requester.email,
                           'type' => signature.requester.type,
                           'cpf_cnpj' => signature.requester.cpf_cnpj,
                           'code' => signature.requester.code,
                           'status' => signature.requester.status,
                           'blocked' => signature.requester.blocked,
                           'birth_date' => signature.requester.birth_date.to_s,
                           'phone' => signature.requester.phone,
                           'optional_email' => signature.requester.optional_email,
                           'optional_phone' => signature.requester.optional_phone,
                           'occupation' => signature.requester.occupation,
                           'created_at' => signature.requester.created_at.iso8601(3),
                           'updated_at' => signature.requester.updated_at.iso8601(3) }
        }
      )
    end
  end

  describe 'GET /v3/printer_flow/signatures/count_by_status' do
    it 'responds with status ok' do
      get '/v3/printer_flow/signatures/count_by_status', headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'renders a JSON with signatures count by status' do
      get '/v3/printer_flow/signatures/count_by_status', headers: credentials

      expect(JSON.parse(response.body)).to include(
        {
          'created' => 1,
          'signed' => 0,
          'refused' => 0
        }
      )
    end
  end
end
