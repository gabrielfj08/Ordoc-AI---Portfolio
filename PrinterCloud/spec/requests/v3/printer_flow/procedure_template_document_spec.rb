require 'rails_helper'

RSpec.describe 'PrinterFlow::ProcedureTemplateDocument', type: :request do
  let!(:procedure_template_document) { create(:procedure_template_document, procedure_template: procedure_template) }
  let(:user) { create(:printer_cloud_user, :with_policies) }
  let(:procedure_template) { create(:printer_flow_procedure_template, organization: user.organization) }

  let(:credentials) do
    { 'Authorization' => "Bearer #{user.token}",
      'X-Api-Subdomain' => user.organization.subdomain }
  end

  describe 'GET /v3/printer_flow/procedure_templates/:procedure_template_id/procedure_template_documents' do
    it 'responds with status ok' do
      get "/v3/printer_flow/procedure_templates/#{procedure_template.id}/procedure_template_documents",
          headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'renders a JSON with all procedure template documents' do
      get "/v3/printer_flow/procedure_templates/#{procedure_template.id}/procedure_template_documents",
          headers: credentials

      expect(JSON.parse(response.body)).to include(
        'printer_flow/procedure_template_documents' => [{
          'id' => procedure_template_document.id,
          'name' => procedure_template_document.name,
          'created_by_id' => procedure_template_document.created_by_id,
          's3_key' => procedure_template_document.s3_key,
          'status' => procedure_template_document.status,
          'procedure_template_id' => procedure_template_document.procedure_template_id,
          'document_id' => procedure_template_document.document_id,
          'created_at' => procedure_template_document.created_at.iso8601(3),
          'updated_at' => procedure_template_document.updated_at.iso8601(3)
        }],
        'meta' => {
          'total' => 1

        }
      )
    end
  end

  describe 'GET /v3/printer_flow/procedure_templates/:procedure_template_id/procedure_template_documents/:id' do
    it 'responds with status ok' do
      get "/v3/printer_flow/procedure_templates/#{procedure_template.id}/procedure_template_documents/#{procedure_template_document.id}",
          headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'renders a JSON with one procedure template documents' do
      get "/v3/printer_flow/procedure_templates/#{procedure_template.id}/procedure_template_documents/#{procedure_template_document.id}",
          headers: credentials

      expect(JSON.parse(response.body)).to include(
        {
          'id' => procedure_template_document.id,
          'name' => procedure_template_document.name,
          'created_by_id' => procedure_template_document.created_by_id,
          's3_key' => procedure_template_document.s3_key,
          'status' => procedure_template_document.status,
          'procedure_template_id' => procedure_template_document.procedure_template_id,
          'document_id' => procedure_template_document.document_id,
          'created_at' => procedure_template_document.created_at.iso8601(3),
          'updated_at' => procedure_template_document.updated_at.iso8601(3)
        }
      )
    end
  end

  describe 'POST /v3/printer_flow/procedure_templates/:procedure_template_id/procedure_template_documents' do
    let(:create_params) do
      { procedure_template_document: { name: 'Protocolo',
                                       s3_key: procedure_template_document.s3_key } }
    end

    it 'responds with status ok' do
      post "/v3/printer_flow/procedure_templates/#{procedure_template.id}/procedure_template_documents", params: create_params,
                                                                                                         headers: credentials

      expect(response).to have_http_status(:created)
    end

    it 'renders a JSON with a created procedure template document' do
      post "/v3/printer_flow/procedure_templates/#{procedure_template.id}/procedure_template_documents", params: create_params,
                                                                                                         headers: credentials

      procedure_template_document_id = JSON.parse(response.body)['id']
      procedure_template_document = ::PrinterFlow::ProcedureTemplateDocument.find(procedure_template_document_id)

      expect(JSON.parse(response.body)).to include(
        {
          'id' => procedure_template_document.id,
          'name' => procedure_template_document.name,
          'created_by_id' => procedure_template_document.created_by_id,
          's3_key' => procedure_template_document.s3_key,
          'status' => procedure_template_document.status,
          'procedure_template_id' => procedure_template_document.procedure_template_id,
          'document_id' => procedure_template_document.document_id,
          'created_at' => procedure_template_document.created_at.iso8601(3),
          'updated_at' => procedure_template_document.updated_at.iso8601(3)
        }
      )
    end
  end

  describe 'DELETE /v3/printer_flow/procedure_templates/:procedure_template_id/procedure_template_documents/:id' do
    it 'responds with status ok' do
      delete "/v3/printer_flow/procedure_templates/#{procedure_template.id}/procedure_template_documents/#{procedure_template_document.id}",
             headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'renders a JSON with deleted procedure template documents' do
      delete "/v3/printer_flow/procedure_templates/#{procedure_template.id}/procedure_template_documents/#{procedure_template_document.id}",
             headers: credentials

      expect(JSON.parse(response.body)).to include(
        {
          'id' => procedure_template_document.id,
          'name' => procedure_template_document.name,
          'created_by_id' => procedure_template_document.created_by_id,
          's3_key' => procedure_template_document.s3_key,
          'status' => procedure_template_document.status,
          'procedure_template_id' => procedure_template_document.procedure_template_id,
          'document_id' => procedure_template_document.document_id,
          'created_at' => procedure_template_document.created_at.iso8601(3),
          'updated_at' => procedure_template_document.updated_at.iso8601(3)
        }
      )
    end
  end
end
