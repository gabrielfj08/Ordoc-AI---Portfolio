require 'rails_helper'

RSpec.describe 'PrinterAir::DocumentUploadJobs', type: :request do
  let(:user) { create(:printer_cloud_user, :with_policies) }
  let(:document_upload_job) do
    create(:document_upload_job, s3_key: "development/#{user.organization.cnpj}/path/file.pdf")
  end

  let(:credentials) do
    { 'Authorization' => "Bearer #{user.token}",
      'X-Api-Subdomain' => user.organization.subdomain }
  end

  describe 'POST v3/printer_air/document_upload_jobs/' do
    let(:create_params) do
      {
        document_upload_job: {
          s3_key: "development/#{user.organization.cnpj}/path/requisitos printer cloud.pdf",
          description: 'Requisitos do Printer Cloud 2.0',
          location: 'Departamento de desenvolvimento',
          created_by_id: user.id
        }
      }
    end
    it 'responds with status ok' do
      post '/v3/printer_air/document_upload_jobs/', headers: credentials, params: create_params

      expect(response).to have_http_status(:ok)
    end

    it 'returns the document upload job' do
      post '/v3/printer_air/document_upload_jobs', headers: credentials, params: create_params

      document_upload_job_id = JSON.parse(response.body)['id']
      document_upload_job = ::PrinterAir::DocumentUploadJob.find(document_upload_job_id)

      expect(JSON.parse(response.body)).to include(
        'id' => document_upload_job.id,
        'status' => document_upload_job.status,
        's3_key' => document_upload_job.s3_key,
        'description' => document_upload_job.description,
        'location' => document_upload_job.location,
        'created_by_id' => document_upload_job.created_by_id,
        'created_at' => document_upload_job.created_at.iso8601(3),
        'updated_at' => document_upload_job.updated_at.iso8601(3)
      )
    end
  end

  describe 'GET v3/printer_air/document_upload_jobs/:id' do
    it 'responds with status ok' do
      get "/v3/printer_air/document_upload_jobs/#{document_upload_job.id}", headers: credentials
      expect(response).to have_http_status(:ok)
    end

    it 'returns the document upload job' do
      get "/v3/printer_air/document_upload_jobs/#{document_upload_job.id}", headers: credentials

      expect(JSON.parse(response.body)).to include(
        'id' => document_upload_job.id,
        'status' => document_upload_job.status,
        's3_key' => document_upload_job.s3_key,
        'description' => document_upload_job.description,
        'location' => document_upload_job.location,
        'created_by_id' => 1,
        'created_at' => document_upload_job.created_at.iso8601(3),
        'updated_at' => document_upload_job.updated_at.iso8601(3)
      )
    end
  end
end
