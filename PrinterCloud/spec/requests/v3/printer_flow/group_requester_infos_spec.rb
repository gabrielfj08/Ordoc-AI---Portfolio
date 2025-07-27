require 'rails_helper'

RSpec.describe 'PrinterFlow::GroupRequesterInfo', type: :request do
  let(:user) { create(:printer_cloud_user, :with_policies) }
  let(:group_requester) { create(:group_requester, organization: user.organization) }
  let(:group_requester_info) { create(:group_requester_info, group_requester: group_requester) }

  let(:credentials) do
    { 'Authorization' => "Bearer #{user.token}",
      'X-Api-Subdomain' => user.organization.subdomain }
  end

  describe 'POST /v3/printer_flow/group_requesters/:group_requester_id/group_requester_infos' do
    it 'responds with status ok' do
      post "/v3/printer_flow/group_requesters/#{group_requester.id}/group_requester_infos", headers: credentials

      expect(response).to have_http_status(:created)
    end

    it 'returns the created group_requester info' do
      post "/v3/printer_flow/group_requesters/#{group_requester.id}/group_requester_infos", headers: credentials

      group_requester_id = JSON.parse(response.body)['id']
      group_requester_info = ::PrinterFlow::GroupRequesterInfo.find(group_requester_id)

      expect(JSON.parse(response.body)).to include(
        'id' => group_requester_info.id,
        'status' => group_requester_info.status,
        'procedures_count' => group_requester_info.procedures_count,
        'created_by_id' => group_requester_info.created_by_id,
        'group_requester_id' => group_requester_info.group_requester_id,
        'created_at' => group_requester_info.created_at.iso8601(3),
        'updated_at' => group_requester_info.updated_at.iso8601(3)
      )
    end
  end

  describe 'GET /v3/printer_flow/group_requesters/:group_requester_id/group_requester_infos/:id' do
    it 'responds with status ok' do
      get "/v3/printer_flow/group_requesters/#{group_requester.id}/group_requester_infos/#{group_requester_info.id}",
          headers: credentials
      expect(response).to have_http_status(:ok)
    end

    it 'returns the group requester info' do
      get "/v3/printer_flow/group_requesters/#{group_requester.id}/group_requester_infos/#{group_requester_info.id}",
          headers: credentials

      expect(JSON.parse(response.body)).to include(
        'id' => group_requester_info.id,
        'status' => group_requester_info.status,
        'procedures_count' => group_requester_info.procedures_count,
        'created_by_id' => group_requester_info.created_by_id,
        'group_requester_id' => group_requester_info.group_requester_id,
        'created_at' => group_requester_info.created_at.iso8601(3),
        'updated_at' => group_requester_info.updated_at.iso8601(3)
      )
    end
  end
end
