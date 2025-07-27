require 'rails_helper'

RSpec.describe 'PrinterFlow::ProcedureTemplateDocument', type: :request do
  let!(:procedure_template_document) do
    create(:procedure_template_document, procedure_template_id: procedure_template.id)
  end
  let(:requester) { create(:external_requester) }
  let(:procedure_template) { create(:printer_flow_procedure_template, organization: requester.organization) }

  let(:credentials) do
    { 'Authorization' => "Bearer #{requester.token}",
      'X-Api-Subdomain' => requester.organization.subdomain }
  end

  describe 'GET /v3/printer_flow/external/procedure_templates/:procedure_template_id/procedure_template_documents' do
    it 'responds with status ok' do
      get "/v3/printer_flow/external/procedure_templates/#{procedure_template.id}/procedure_template_documents",
          headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'renders a JSON with all procedure template documents' do
      get "/v3/printer_flow/external/procedure_templates/#{procedure_template.id}/procedure_template_documents",
          headers: credentials

      expect(JSON.parse(response.body)).to include(
        'printer_flow/procedure_template_documents' => [{
          'id' => procedure_template_document.id,
          'name' => procedure_template_document.name
        }],
        'meta' => {
          'total' => 1

        }
      )
    end
  end

  describe 'GET /v3/printer_flow/external/procedure_templates/:procedure_template_id/procedure_template_documents/:id' do
    it 'responds with status ok' do
      get "/v3/printer_flow/external/procedure_templates/#{procedure_template.id}/procedure_template_documents/#{procedure_template_document.id}",
          headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'renders a JSON with one procedure template documents' do
      get "/v3/printer_flow/external/procedure_templates/#{procedure_template.id}/procedure_template_documents/#{procedure_template_document.id}",
          headers: credentials

      expect(JSON.parse(response.body)).to include(
        {
          'id' => procedure_template_document.id,
          'name' => procedure_template_document.name,
          'document_url' => procedure_template_document.document.url
        }
      )
    end
  end
end
