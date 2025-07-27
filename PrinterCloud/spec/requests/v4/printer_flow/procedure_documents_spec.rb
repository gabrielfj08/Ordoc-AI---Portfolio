require 'rails_helper'

RSpec.describe 'PrinterFlow::ProcedureDocument', type: :request do
  let!(:procedure_document) { create(:procedure_document, procedure: procedure) }
  let(:user) { create(:printer_cloud_user) }
  let(:procedure) do
    create(:printer_flow_procedure, :with_attachment_field, created_by: user)
  end

  let(:credentials) do
    { 'Authorization' => "Bearer #{user.token}",
      'X-Api-Subdomain' => user.organization.subdomain }
  end

  describe 'GET /v4/printer_flow/procedures/:procedure_id/procedure_documents' do
    it 'responds with status ok' do
      get "/v4/printer_flow/procedures/#{procedure.id}/procedure_documents",
          headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'renders a JSON with all procedure documents' do
      get "/v4/printer_flow/procedures/#{procedure.id}/procedure_documents",
          headers: credentials

      expect(JSON.parse(response.body)).to include(
        'printer_flow/procedure_documents' => [{
          'id' => procedure_document.id,
          'name' => procedure_document.name,
          'created_by_id' => procedure_document.created_by_id,
          'uuid' => procedure_document.uuid,
          'key' => procedure_document.key,
          'source' => procedure_document.source,
          'status' => procedure_document.status,
          'procedure_id' => procedure_document.procedure_id,
          'document_id' => procedure_document.document_id,
          'signed_document_id' => procedure_document.signed_document_id,
          'created_at' => procedure_document.created_at.iso8601(3),
          'updated_at' => procedure_document.updated_at.iso8601(3)
        }],
        'meta' => {
          'total' => 1

        }
      )
    end
  end

  describe 'GET /v4/printer_flow/procedures/:procedure_id/procedure_documents/:uuid' do
    it 'responds with status ok' do
      get "/v4/printer_flow/procedures/#{procedure.id}/procedure_documents/#{procedure_document.uuid}",
          headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'renders a JSON with one procedure document' do
      get "/v4/printer_flow/procedures/#{procedure.id}/procedure_documents/#{procedure_document.uuid}",
          headers: credentials

      expect(JSON.parse(response.body)).to include(
        {
          'id' => procedure_document.id,
          'name' => procedure_document.name,
          'created_by_id' => procedure_document.created_by_id,
          'uuid' => procedure_document.uuid,
          'key' => procedure_document.key,
          'source' => procedure_document.source,
          'status' => procedure_document.status,
          'procedure_id' => procedure_document.procedure_id,
          'document_id' => procedure_document.document_id,
          'document_url' => procedure_document.document_url,
          'signed_document_id' => procedure_document.signed_document_id,
          'created_at' => procedure_document.created_at.iso8601(3),
          'updated_at' => procedure_document.updated_at.iso8601(3)
        }
      )
    end
  end

  describe 'POST /v4/printer_flow/procedures/:procedure_id/procedure_documents' do
    let(:create_params) do
      {
        procedure_document: {
          name: 'Protocolo',
          key: procedure_document.key,
          source: 'upload'
        }
      }
    end

    it 'responds with status ok' do
      post "/v4/printer_flow/procedures/#{procedure.id}/procedure_documents", params: create_params,
                                                                              headers: credentials

      expect(response).to have_http_status(:created)
    end

    it 'renders a JSON with a created procedure document' do
      post "/v4/printer_flow/procedures/#{procedure.id}/procedure_documents", params: create_params,
                                                                              headers: credentials

      procedure_document_id = JSON.parse(response.body)['id']
      procedure_document = ::PrinterFlow::ProcedureDocument.find(procedure_document_id)

      expect(JSON.parse(response.body)).to include(
        {
          'id' => procedure_document.id,
          'name' => procedure_document.name,
          'created_by_id' => procedure_document.created_by_id,
          'uuid' => procedure_document.uuid,
          'key' => procedure_document.key,
          'source' => procedure_document.source,
          'status' => procedure_document.status,
          'procedure_id' => procedure_document.procedure_id,
          'document_id' => procedure_document.document_id,
          'document_url' => procedure_document.document_url,
          'signed_document_id' => procedure_document.signed_document_id,
          'created_at' => procedure_document.created_at.iso8601(3),
          'updated_at' => procedure_document.updated_at.iso8601(3)
        }
      )
    end
  end

  describe 'DELETE /v4/printer_flow/procedures/:procedure_id/procedure_documents/:id' do
    it 'responds with status ok' do
      delete "/v4/printer_flow/procedures/#{procedure.id}/procedure_documents/#{procedure_document.id}",
             headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'renders a JSON with deleted procedure document' do
      delete "/v4/printer_flow/procedures/#{procedure.id}/procedure_documents/#{procedure_document.id}",
             headers: credentials

      expect(JSON.parse(response.body)).to include(
        {
          'id' => procedure_document.id,
          'name' => procedure_document.name,
          'created_by_id' => procedure_document.created_by_id,
          'uuid' => procedure_document.uuid,
          'key' => procedure_document.key,
          'source' => procedure_document.source,
          'status' => procedure_document.status,
          'procedure_id' => procedure_document.procedure_id,
          'document_id' => procedure_document.document_id,
          'document_url' => procedure_document.document_url,
          'signed_document_id' => procedure_document.signed_document_id,
          'created_at' => procedure_document.created_at.iso8601(3),
          'updated_at' => procedure_document.updated_at.iso8601(3)
        }
      )
    end
  end
end
