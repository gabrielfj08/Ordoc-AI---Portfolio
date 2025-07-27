require 'rails_helper'

RSpec.describe 'PrinterAir::DownloadJobs', type: :request do
  let(:user) { create(:printer_cloud_user, :with_policies) }
  let(:directory) { create(:printer_air_directory, organization: user.organization) }
  let(:download_job) { create(:download_job, targets: { directory_ids: [directory.id] }) }

  let(:credentials) do
    { 'Authorization' => "Bearer #{user.token}",
      'X-Api-Subdomain' => user.organization.subdomain }
  end

  describe 'POST v3/printer_air/download_jobs/' do
    let(:create_params) do
      {
        download_job: {
          targets: {
            directory_ids: [directory.id],
            document_ids: []
          }
        }
      }
    end

    it 'responds with status ok' do
      post '/v3/printer_air/download_jobs', headers: credentials, params: create_params

      expect(response).to have_http_status(:ok)
    end

    it 'returns the download job' do
      post '/v3/printer_air/download_jobs', headers: credentials, params: create_params

      download_job_id = JSON.parse(response.body)['id']
      download_job = ::PrinterAir::DownloadJob.find(download_job_id)

      expect(JSON.parse(response.body)).to include(
        'id' => download_job.id,
        'status' => download_job.status,
        's3_key' => download_job.s3_key,
        'targets' => download_job.targets,
        'uuid' => download_job.uuid,
        'download_link' => download_job.download_link,
        'created_by_id' => download_job.created_by_id,
        'created_at' => download_job.created_at.iso8601(3),
        'updated_at' => download_job.updated_at.iso8601(3)
      )
    end
  end

  describe 'GET v3/printer_air/download_job/:id' do
    it 'responds with status ok' do
      get "/v3/printer_air/download_jobs/#{download_job.id}", headers: credentials
      expect(response).to have_http_status(:ok)
    end

    it 'returns the document upload job' do
      get "/v3/printer_air/download_jobs/#{download_job.id}", headers: credentials

      expect(JSON.parse(response.body)).to include(
        'id' => download_job.id,
        'status' => download_job.status,
        's3_key' => download_job.s3_key,
        'targets' => download_job.targets,
        'uuid' => download_job.uuid,
        'download_link' => download_job.download_link,
        'created_by_id' => download_job.created_by_id,
        'created_at' => download_job.created_at.iso8601(3),
        'updated_at' => download_job.updated_at.iso8601(3)
      )
    end
  end
end
