require 'rails_helper'

RSpec.describe 'PrinterFlow::FieldDocumentTemplate', type: :request do
  let!(:field_document_template) { create(:field_document_template, organization: requester.organization) }
  let(:requester) { create(:external_requester) }
  let(:credentials) do
    { 'Authorization' => "Bearer #{requester.token}",
      'X-Api-Subdomain' => requester.organization.subdomain }
  end

  describe 'GET /v3/printer_flow/external/field_document_templates' do
    it 'responds with status ok' do
      get '/v3/printer_flow/external/field_document_templates', headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'renders a JSON with all field document templates' do
      get '/v3/printer_flow/external/field_document_templates', headers: credentials

      expect(JSON.parse(response.body)).to include(
        'printer_flow/field_document_templates' => [{
          'id' => field_document_template.id,
          'name' => field_document_template.name
        }],
        'meta' => {
          'total' => 1

        }
      )
    end
  end

  describe 'GET /v3/printer_flow/external/field_document_templates/:id' do
    it 'responds with status ok' do
      get "/v3/printer_flow/external/field_document_templates/#{field_document_template.id}", headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'renders a JSON with a field document template' do
      get "/v3/printer_flow/external/field_document_templates/#{field_document_template.id}", headers: credentials

      expect(JSON.parse(response.body)).to include({
                                                     'id' => field_document_template.id,
                                                     'name' => field_document_template.name,
                                                     'document_url' => field_document_template.document.url
                                                   })
    end
  end
end
