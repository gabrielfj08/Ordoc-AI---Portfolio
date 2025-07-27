require 'rails_helper'

RSpec.describe 'PrinterAir::DirectoryInfo', type: :request do
  let(:user) { create(:printer_cloud_user, :with_policies) }
  let(:directory) { create(:printer_air_directory, organization: user.organization) }
  let(:directory_info) { create(:directory_info, directory: directory) }

  let(:credentials) do
    { 'Authorization' => "Bearer #{user.token}",
      'X-Api-Subdomain' => user.organization.subdomain }
  end

  describe 'POST v3/printer_air/directories/:directory_id/directory_infos' do
    it 'responds with status ok' do
      post "/v3/printer_air/directories/#{directory.id}/directory_infos", headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'returns the created directory info' do
      post "/v3/printer_air/directories/#{directory.id}/directory_infos", headers: credentials

      directory_info_id = JSON.parse(response.body)['id']
      directory_info = ::PrinterAir::DirectoryInfo.find(directory_info_id)

      expect(JSON.parse(response.body)).to include(
        'id' => directory_info.id,
        'status' => directory_info.status,
        'total_size' => directory_info.total_size,
        'total_directories_count' => directory_info.total_directories_count,
        'total_documents_count' => directory_info.total_documents_count,
        'created_by_id' => directory_info.created_by_id,
        'directory_id' => directory_info.directory_id,
        'created_at' => directory_info.created_at.iso8601(3),
        'updated_at' => directory_info.updated_at.iso8601(3)
      )
    end
  end

  describe 'GET v3/printer_air/directories/:directory_id/directory_infos/:id' do
    it 'responds with status ok' do
      get "/v3/printer_air/directories/#{directory.id}/directory_infos/#{directory_info.id}",
          headers: credentials
      expect(response).to have_http_status(:ok)
    end

    it 'returns the directory info' do
      get "/v3/printer_air/directories/#{directory.id}/directory_infos/#{directory_info.id}",
          headers: credentials

      directory_info_id = JSON.parse(response.body)['id']
      directory_info = ::PrinterAir::DirectoryInfo.find(directory_info_id)

      expect(JSON.parse(response.body)).to include(
        'id' => directory_info.id,
        'status' => directory_info.status,
        'total_size' => directory_info.total_size,
        'total_directories_count' => directory_info.total_directories_count,
        'total_documents_count' => directory_info.total_documents_count,
        'created_by_id' => directory_info.created_by_id,
        'directory_id' => directory_info.directory_id,
        'created_at' => directory_info.created_at.iso8601(3),
        'updated_at' => directory_info.updated_at.iso8601(3)
      )
    end
  end
end
