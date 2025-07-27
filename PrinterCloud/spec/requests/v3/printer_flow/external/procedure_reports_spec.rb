require 'rails_helper'

RSpec.describe 'PrinterFlow::External::ProcedureReport', type: :request do
  let(:procedure_report) { create(:external_procedure_report, procedure: procedure) }
  let(:requester) { create(:external_requester) }
  let(:procedure) do
    create(:printer_flow_procedure, organization: requester.organization, requester: requester)
  end

  let(:credentials) do
    { 'Authorization' => "Bearer #{requester.token}",
      'X-Api-Subdomain' => requester.organization.subdomain }
  end

  describe 'POST /v3/printer_flow/external/procedures/:procedure_id/procedure_reports' do
    it 'responds with status ok' do
      post "/v3/printer_flow/external/procedures/#{procedure.id}/procedure_reports", headers: credentials

      expect(response).to have_http_status(:created)
    end

    it 'renders a JSON with the created external procedure report' do
      post "/v3/printer_flow/external/procedures/#{procedure.id}/procedure_reports", headers: credentials

      procedure_report_id = JSON.parse(response.body)['id']
      procedure_report = ::PrinterFlow::External::ProcedureReport.find(procedure_report_id)

      expect(JSON.parse(response.body)).to include(
        'id' => procedure_report.id,
        'status' => procedure_report.status,
        'procedure_id' => procedure_report.procedure_id,
        'procedure_status' => procedure_report.procedure_status,
        'document_id' => procedure_report.document_id,
        'document_url' => nil,
        'created_at' => procedure_report.created_at.iso8601(3),
        'updated_at' => procedure_report.updated_at.iso8601(3)
      )
    end
  end

  describe 'GET /v3/printer_flow/external/procedures/:procedure_id/procedure_reports/:id' do
    it 'responds with status ok' do
      get "/v3/printer_flow/external/procedures/#{procedure.id}/procedure_reports/#{procedure_report.id}",
          headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'renders a JSON with a external procedure report' do
      get "/v3/printer_flow/external/procedures/#{procedure.id}/procedure_reports/#{procedure_report.id}",
          headers: credentials

      expect(JSON.parse(response.body)).to include(
        'id' => procedure_report.id,
        'status' => procedure_report.status,
        'procedure_id' => procedure_report.procedure_id,
        'procedure_status' => procedure_report.procedure_status,
        'document_id' => procedure_report.document_id,
        'document_url' => procedure_report.document.url,
        'created_at' => procedure_report.created_at.iso8601(3),
        'updated_at' => procedure_report.updated_at.iso8601(3)
      )
    end
  end
end
