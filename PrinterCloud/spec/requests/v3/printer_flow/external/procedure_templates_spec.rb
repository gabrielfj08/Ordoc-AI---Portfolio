require 'rails_helper'

RSpec.describe 'PrinterFlow::ProcedureTemplate', type: :request do
  let!(:procedure_template) do
    create(:printer_flow_procedure_template, :child_template, organization: requester.organization)
  end
  let(:requester) { create(:external_requester) }

  let(:credentials) do
    { 'Authorization' => "Bearer #{requester.token}",
      'X-Api-Subdomain' => requester.organization.subdomain }
  end

  describe 'GET /v3/printer_flow/external/procedure_templates' do
    it 'responds with status ok' do
      get '/v3/printer_flow/external/procedure_templates', headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'renders a JSON with all procedure templates' do
      get '/v3/printer_flow/external/procedure_templates', headers: credentials

      expect(JSON.parse(response.body)).to include(
        'printer_flow/procedure_templates' => [{
          'id' => procedure_template.id,
          'name' => procedure_template.name

        }],
        'meta' => { 'total' => 1 }
      )
    end
  end

  describe 'GET /v3/printer_flow/external/procedure_templates/:id' do
    it 'responds with status ok' do
      get "/v3/printer_flow/external/procedure_templates/#{procedure_template.id}", headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'renders a JSON with the procedure template' do
      get "/v3/printer_flow/external/procedure_templates/#{procedure_template.id}", headers: credentials

      expect(JSON.parse(response.body)).to include(
        'id' => procedure_template.id,
        'name' => procedure_template.name,
        'group_requester' => {
          'id' => procedure_template.group_requester.id,
          'name' => procedure_template.group_requester.name,
          'parent_group_id' => procedure_template.group_requester.parent_group_id,
          'prn' => procedure_template.group_requester.prn,
          'code' => procedure_template.group_requester.code,
          'status' => procedure_template.group_requester.status,
          'created_at' => procedure_template.group_requester.created_at.iso8601(3),
          'updated_at' => procedure_template.group_requester.updated_at.iso8601(3)
        }
      )
    end
  end
end
