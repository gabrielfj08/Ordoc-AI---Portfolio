require 'rails_helper'

RSpec.describe 'PrinterFlow::ProcedureReport', type: :request do
  let!(:procedure_report) { create(:procedure_report, procedure: procedure) }
  let(:user) { create(:printer_cloud_user, :with_policies) }
  let(:procedure) { create(:printer_flow_procedure, created_by: user) }

  let(:credentials) do
    { 'Authorization' => "Bearer #{user.token}",
      'X-Api-Subdomain' => user.organization.subdomain }
  end

  describe 'GET /v3/printer_flow/procedures/:procedure_id/procedure_reports' do
    it 'responds with status ok' do
      get "/v3/printer_flow/procedures/#{procedure.id}/procedure_reports",
          headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'renders a JSON with all procedure reports' do
      get "/v3/printer_flow/procedures/#{procedure.id}/procedure_reports",
          headers: credentials

      expect(JSON.parse(response.body)).to include(
        'printer_flow/procedure_reports' => [{
          'id' => procedure_report.id,
          'created_by_id' => procedure_report.created_by_id,
          'status' => procedure_report.status,
          'procedure_id' => procedure_report.procedure_id,
          'document_id' => procedure_report.document_id,
          'created_at' => procedure_report.created_at.iso8601(3),
          'updated_at' => procedure_report.updated_at.iso8601(3)
        }],
        'meta' => {
          'total' => 1

        }
      )
    end
  end

  describe 'GET /v3/printer_flow/procedures/:procedure_id/procedure_reports/:id' do
    it 'responds with status ok' do
      get "/v3/printer_flow/procedures/#{procedure.id}/procedure_reports/#{procedure_report.id}",
          headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'renders a JSON with one procedure report' do
      get "/v3/printer_flow/procedures/#{procedure.id}/procedure_reports/#{procedure_report.id}",
          headers: credentials

      expect(JSON.parse(response.body)).to include(
        {
          'id' => procedure_report.id,
          'created_by_id' => procedure_report.created_by_id,
          'status' => procedure_report.status,
          'procedure_id' => procedure_report.procedure_id,
          'document_id' => procedure_report.document_id,
          'created_at' => procedure_report.created_at.iso8601(3),
          'updated_at' => procedure_report.updated_at.iso8601(3)
        }
      )
    end
  end

  describe 'POST /v3/printer_flow/procedures/:procedure_id/procedure_reports' do
    it 'responds with status ok' do
      post "/v3/printer_flow/procedures/#{procedure.id}/procedure_reports", headers: credentials

      expect(response).to have_http_status(:created)
    end

    it 'renders a JSON with a created procedure report' do
      post "/v3/printer_flow/procedures/#{procedure.id}/procedure_reports", headers: credentials

      procedure_report_id = JSON.parse(response.body)['id']
      procedure_report = ::PrinterFlow::ProcedureReport.find(procedure_report_id)

      expect(JSON.parse(response.body)).to include(
        {
          'id' => procedure_report.id,
          'created_by_id' => procedure_report.created_by_id,
          'status' => procedure_report.status,
          'procedure_id' => procedure_report.procedure_id,
          'document_id' => procedure_report.document_id,
          'created_at' => procedure_report.created_at.iso8601(3),
          'updated_at' => procedure_report.updated_at.iso8601(3)
        }
      )
    end
  end

  describe 'DELETE /v3/printer_flow/procedures/:procedure_id/procedure_reports/:id' do
    it 'responds with status ok' do
      delete "/v3/printer_flow/procedures/#{procedure.id}/procedure_reports/#{procedure_report.id}",
             headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'renders a JSON with deleted procedure report' do
      delete "/v3/printer_flow/procedures/#{procedure.id}/procedure_reports/#{procedure_report.id}",
             headers: credentials

      expect(JSON.parse(response.body)).to include(
        {
          'id' => procedure_report.id,
          'created_by_id' => procedure_report.created_by_id,
          'status' => procedure_report.status,
          'procedure_id' => procedure_report.procedure_id,
          'document_id' => procedure_report.document_id,
          'created_at' => procedure_report.created_at.iso8601(3),
          'updated_at' => procedure_report.updated_at.iso8601(3)
        }
      )
    end
  end

  describe 'POST /v3/printer_flow/procedure_reports/save' do
    let(:directory) { create(:printer_air_directory, organization: user.organization) }
    let(:params) do
      {
        report_ids: [procedure.id],
        directory_id: directory.id.to_s
      }
    end

    it 'responds with status ok' do
      post '/v3/printer_flow/procedure_reports/save', headers: credentials, params: params

      expect(response).to have_http_status(:ok)
    end

    it 'renders a JSON with a batch operation, returning procedure reports saved on printer air directory' do
      post '/v3/printer_flow/procedure_reports/save', headers: credentials, params: params

      batch_operation_id = JSON.parse(response.body)['id']
      batch_operation = ::PrinterFlow::BatchOperation.find(batch_operation_id)

      expect(JSON.parse(response.body)).to include(
        'id' => batch_operation.id,
        'ids' =>
          batch_operation.ids,
        'payload' => {
          'directory_id' => directory.id.to_s
        },
        'action' => batch_operation.action,
        'record_type' => 'PrinterFlow::Procedure',
        'created_by_id' => user.id,
        'status' => batch_operation.status,
        'created_at' => batch_operation.created_at.iso8601(3),
        'updated_at' => batch_operation.updated_at.iso8601(3)
      )
    end
  end
end
