require 'rails_helper'

RSpec.describe 'PrinterFlow::RequesterInfo', type: :request do
  let!(:requester_info) { create(:requester_info, requester_id: user.internal_requester.id) }
  let(:user) { create(:printer_cloud_user, :with_policies) }
  let(:procedure) { create(:printer_flow_procedure) }

  let(:credentials) do
    { 'Authorization' => "Bearer #{user.token}",
      'X-Api-Subdomain' => user.organization.subdomain }
  end

  describe 'POST /v3/printer_flow/requesters/:requester_id/requester_infos' do
    it 'responds with status ok' do
      post "/v3/printer_flow/requesters/#{user.internal_requester.id}/requester_infos", headers: credentials

      expect(response).to have_http_status(:created)
    end

    it 'returns the created requester info' do
      post "/v3/printer_flow/requesters/#{user.internal_requester.id}/requester_infos", headers: credentials

      requester_id = JSON.parse(response.body)['id']
      requester_info = ::PrinterFlow::RequesterInfo.find(requester_id)

      expect(JSON.parse(response.body)).to include(
        'id' => requester_info.id,
        'status' => requester_info.status,
        'procedures_count' => requester_info.procedures_count,
        'created_by_id' => requester_info.created_by_id,
        'requester_id' => requester_info.requester_id,
        'created_at' => requester_info.created_at.iso8601(3),
        'updated_at' => requester_info.updated_at.iso8601(3)
      )
    end
  end

  describe 'GET /v3/printer_flow/requesters/:requester_id/requester_infos/:id' do
    it 'responds with status ok' do
      get "/v3/printer_flow/requesters/#{user.internal_requester.id}/requester_infos/#{requester_info.id}",
          headers: credentials
      expect(response).to have_http_status(:ok)
    end

    it 'returns the group requester info' do
      get "/v3/printer_flow/requesters/#{user.internal_requester.id}/requester_infos/#{requester_info.id}",
          headers: credentials

      expect(JSON.parse(response.body)).to include(
        'id' => requester_info.id,
        'status' => requester_info.status,
        'procedures_count' => requester_info.procedures_count,
        'created_by_id' => requester_info.created_by_id,
        'requester_id' => requester_info.requester_id,
        'created_at' => requester_info.created_at.iso8601(3),
        'updated_at' => requester_info.updated_at.iso8601(3)
      )
    end
  end
end
