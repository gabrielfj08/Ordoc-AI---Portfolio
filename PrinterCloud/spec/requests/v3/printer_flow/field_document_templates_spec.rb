require 'rails_helper'

RSpec.describe 'PrinterFlow::FieldDocumentTemplate', type: :request do
  let!(:field_document_template) { create(:field_document_template, organization: user.organization) }
  let(:user) { create(:printer_cloud_user) }

  let(:credentials) do
    { 'Authorization' => "Bearer #{user.token}",
      'X-Api-Subdomain' => user.organization.subdomain }
  end

  describe 'GET /v3/printer_flow/field_document_templates' do
    it 'responds with status ok' do
      get '/v3/printer_flow/field_document_templates', headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'renders a JSON with all field document templates' do
      get '/v3/printer_flow/field_document_templates', headers: credentials

      expect(JSON.parse(response.body)).to include(
        'printer_flow/field_document_templates' => [{
          'id' => field_document_template.id,
          'name' => field_document_template.name,
          's3_key' => field_document_template.s3_key,
          'status' => field_document_template.status,
          'organization_id' => field_document_template.organization_id,
          'document_id' => field_document_template.document_id,
          'created_at' => field_document_template.created_at.iso8601(3),
          'updated_at' => field_document_template.updated_at.iso8601(3)
        }],
        'meta' => {
          'total' => 1

        }
      )
    end
  end

  describe 'POST /v3/printer_flow/field_document_templates' do
    let(:create_params) do
      { field_document_template: { name: 'Comprovante de Renda',
                                   s3_key: field_document_template.s3_key } }
    end
    it 'responds with status ok' do
      post '/v3/printer_flow/field_document_templates', params: create_params, headers: credentials

      expect(response).to have_http_status(:created)
    end

    it 'renders a JSON with created field document templates' do
      post '/v3/printer_flow/field_document_templates', params: create_params, headers: credentials

      field_document_template_id = JSON.parse(response.body)['id']
      field_document_template = PrinterFlow::FieldDocumentTemplate.find(field_document_template_id)

      expect(JSON.parse(response.body)).to include({
                                                     'id' => field_document_template.id,
                                                     'name' => field_document_template.name,
                                                     'status' => field_document_template.status,
                                                     'organization_id' => field_document_template.organization_id,
                                                     'document_id' => field_document_template.document_id,
                                                     'created_at' => field_document_template.created_at.iso8601(3),
                                                     'updated_at' => field_document_template.updated_at.iso8601(3)
                                                   })
    end
  end

  describe 'GET /v3/printer_flow/field_document_templates/:id' do
    it 'responds with status ok' do
      get "/v3/printer_flow/field_document_templates/#{field_document_template.id}", headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'renders a JSON with a field document template' do
      get "/v3/printer_flow/field_document_templates/#{field_document_template.id}", headers: credentials

      expect(JSON.parse(response.body)).to include({
                                                     'id' => field_document_template.id,
                                                     'name' => field_document_template.name,
                                                     'status' => field_document_template.status,
                                                     'organization_id' => field_document_template.organization_id,
                                                     'document_id' => field_document_template.document_id,
                                                     'document_url' => field_document_template.document.url,
                                                     'created_at' => field_document_template.created_at.iso8601(3),
                                                     'updated_at' => field_document_template.updated_at.iso8601(3)
                                                   })
    end
  end
end
