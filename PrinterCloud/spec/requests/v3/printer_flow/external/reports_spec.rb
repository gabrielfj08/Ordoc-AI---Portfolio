require 'rails_helper'

RSpec.describe 'PrinterFlow::External::Report', type: :request do
  let!(:report) { create(:report, external_requester: requester) }
  let(:requester) { create(:external_requester) }

  let(:credentials) do
    { 'Authorization' => "Bearer #{requester.token}",
      'X-Api-Subdomain' => requester.organization.subdomain }
  end

  describe 'GET /v3/printer_flow/external/reports/:id' do
    it 'responds with status ok' do
      get "/v3/printer_flow/external/reports/#{report.id}", headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'renders a JSON with the report' do
      get "/v3/printer_flow/external/reports/#{report.id}", headers: credentials

      expect(JSON.parse(response.body)).to include(
        'id' => report.id,
        'external_requester_id' => report.external_requester.id,
        'status' => report.status,
        'procedures_running_count' => report.procedures_running_count,
        'procedures_started_count' => report.procedures_started_count,
        'tasks_running_count' => report.tasks_running_count,
        'signatures_pending_count' => report.signatures_pending_count,
        'shared_procedures_pending_count' => report.shared_procedures_pending_count,
        'created_at' => report.created_at.iso8601(3),
        'updated_at' => report.updated_at.iso8601(3)
      )
    end
  end

  describe 'POST /v3/printer_flow/external/reports' do
    it 'responds with status ok' do
      post '/v3/printer_flow/external/reports', headers: credentials

      expect(response).to have_http_status(:created)
    end

    it 'renders a JSON with the created report' do
      post '/v3/printer_flow/external/reports/', headers: credentials

      report.reload

      expect(JSON.parse(response.body)).to include(
        'id' => report.id,
        'external_requester_id' => report.external_requester.id,
        'status' => report.status,
        'procedures_running_count' => report.procedures_running_count,
        'procedures_started_count' => report.procedures_started_count,
        'tasks_running_count' => report.tasks_running_count,
        'signatures_pending_count' => report.signatures_pending_count,
        'shared_procedures_pending_count' => report.shared_procedures_pending_count,
        'created_at' => report.created_at.iso8601(3),
        'updated_at' => report.updated_at.iso8601(3)
      )
    end
  end
end
