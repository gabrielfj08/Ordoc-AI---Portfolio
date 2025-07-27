require 'rails_helper'

RSpec.describe 'PrinterAir::DirectoryUploadJobs', type: :request do
  let!(:user) { create(:printer_cloud_user, :with_policies) }
  let(:directory_upload_job) do
    create(:directory_upload_job, s3_key: "development/#{user.organization.cnpj}/path/zipfile.zip")
  end

  let(:credentials) do
    { 'Authorization' => "Bearer #{user.token}",
      'X-Api-Subdomain' => user.organization.subdomain }
  end

  describe 'POST v3/printer_air/directory_upload_jobs/' do
    let(:create_params) do
      {
        directory_upload_job: {
          s3_key: "development/#{user.organization.cnpj}/path/zipfile.zip",
          description: 'Requisitos do Printer Cloud 2.0',
          location: 'Departamento de desenvolvimento'
        }
      }
    end

    it 'responds with status ok' do
      post '/v3/printer_air/directory_upload_jobs/', headers: credentials, params: create_params

      expect(response).to have_http_status(:ok)
    end

    it 'returns the created directory upload job' do
      post '/v3/printer_air/directory_upload_jobs', headers: credentials, params: create_params

      directory_upload_job_id = JSON.parse(response.body)['id']
      directory_upload_job = ::PrinterAir::DirectoryUploadJob.find(directory_upload_job_id)

      expect(JSON.parse(response.body)).to include(
        'id' => directory_upload_job.id,
        'status' => directory_upload_job.status,
        's3_key' => directory_upload_job.s3_key,
        'description' => directory_upload_job.description,
        'location' => directory_upload_job.location,
        'created_by_id' => directory_upload_job.created_by_id,
        'created_at' => directory_upload_job.created_at.iso8601(3),
        'updated_at' => directory_upload_job.updated_at.iso8601(3)
      )
    end
  end

  describe 'GET v3/printer_air/directory_upload_jobs/:id' do
    it 'responds with status ok' do
      get "/v3/printer_air/directory_upload_jobs/#{directory_upload_job.id}", headers: credentials
      expect(response).to have_http_status(:ok)
    end

    it 'returns the directory upload job' do
      get "/v3/printer_air/directory_upload_jobs/#{directory_upload_job.id}", headers: credentials

      expect(JSON.parse(response.body)).to include(
        'id' => directory_upload_job.id,
        'status' => directory_upload_job.status,
        's3_key' => directory_upload_job.s3_key,
        'description' => directory_upload_job.description,
        'location' => directory_upload_job.location,
        'created_by_id' => directory_upload_job.created_by_id,
        'created_at' => directory_upload_job.created_at.iso8601(3),
        'updated_at' => directory_upload_job.updated_at.iso8601(3)
      )
    end
  end
end
