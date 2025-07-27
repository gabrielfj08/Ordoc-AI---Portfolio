require 'rails_helper'

RSpec.describe 'PrinterFlow::Field', type: :request do
  let!(:field) { create(:field, procedure_template_id: procedure_template.id, field_type: 'attachment') }
  let(:requester) { create(:external_requester) }
  let(:procedure_template) do
    create(:printer_flow_procedure_template, organization: requester.organization)
  end

  let(:credentials) do
    { 'Authorization' => "Bearer #{requester.token}",
      'X-Api-Subdomain' => requester.organization.subdomain }
  end

  describe 'GET /v3/printer_flow/external/procedure_templates/:procedure_template_id/fields' do
    it 'responds with status ok' do
      get "/v3/printer_flow/external/procedure_templates/#{procedure_template.id}/fields", headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'renders a JSON with all fields' do
      get "/v3/printer_flow/external/procedure_templates/#{procedure_template.id}/fields", headers: credentials

      expect(JSON.parse(response.body)).to include(
        'printer_flow/fields' => [{
          'id' => field.id,
          'label' => field.label,
          'field_document_template' => field.field_document_template,
          'field_type' => field.field_type,
          'field_value_options' => field.field_value_options,
          'required' => field.required,
          'procedure_template_id' => field.procedure_template_id,
          'created_at' => field.created_at.iso8601(3),
          'updated_at' => field.updated_at.iso8601(3)
        }],
        'meta' => {
          'total' => 1

        }
      )
    end
  end

  describe 'GET /v3/printer_flow/external/procedure_templates/:procedure_template_id/fields/:fields_id' do
    it 'responds with status ok' do
      get "/v3/printer_flow/external/procedure_templates/#{procedure_template.id}/fields/#{field.id}",
          headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'renders a JSON with the field' do
      get "/v3/printer_flow/external/procedure_templates/#{procedure_template.id}/fields/#{field.id}",
          headers: credentials

      expect(JSON.parse(response.body)).to include(
        {
          'id' => field.id,
          'label' => field.label,
          'field_type' => field.field_type,
          'required' => field.required,
          'field_document_template' => field.field_document_template,
          'procedure_template_id' => field.procedure_template_id,
          'created_at' => field.created_at.iso8601(3),
          'updated_at' => field.updated_at.iso8601(3)
        }
      )
    end
  end
end
