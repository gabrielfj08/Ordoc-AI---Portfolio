require 'rails_helper'

RSpec.describe 'PrinterSign::Signature', type: :request do
  let!(:signature) { create(:signature, :created, requester: requester, procedure: procedure) }
  let(:requester) { create(:external_requester) }
  let(:procedure) do
    create(:printer_flow_procedure, :external, requester: requester, organization: requester.organization)
  end

  let(:credentials) do
    { 'Authorization' => "Bearer #{requester.token}",
      'X-Api-Subdomain' => requester.organization.subdomain }
  end

  describe 'GET /v3/printer_flow/external/signatures' do
    it 'responds with status ok' do
      get '/v3/printer_flow/external/signatures', headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'renders a JSON with all signatures' do
      get '/v3/printer_flow/external/signatures', headers: credentials

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

  describe 'GET /v3/printer_flow/external/signatures/:id' do
    it 'responds with status ok' do
      get "/v3/printer_flow/external/signatures/#{signature.id}", headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'renders a JSON with the signature' do
      get "/v3/printer_flow/external/signatures/#{signature.id}", headers: credentials

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
          'updated_at' => signature.updated_at.iso8601(3)
        }
      )
    end
  end

  describe 'PUT /v3/printer_flow/external/signatures/:id/sign' do
    it 'responds with status ok' do
      put "/v3/printer_flow/external/signatures/#{signature.id}/sign", headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'renders a JSON with a signed signatures' do
      put "/v3/printer_flow/external/signatures/#{signature.id}/sign", headers: credentials

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
          }
        }
      )
    end
  end

  describe 'PUT /v3/printer_flow/external/signatures/:id/refuse' do
    let(:params) do
      {
        note: 'Documento esta incompleto'
      }
    end
    it 'responds with status ok' do
      put "/v3/printer_flow/external/signatures/#{signature.id}/refuse", headers: credentials, params: params

      expect(response).to have_http_status(:ok)
    end

    it 'renders a JSON with a refused signature' do
      put "/v3/printer_flow/external/signatures/#{signature.id}/refuse", headers: credentials, params: params

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
          }
        }
      )
    end
  end
end
