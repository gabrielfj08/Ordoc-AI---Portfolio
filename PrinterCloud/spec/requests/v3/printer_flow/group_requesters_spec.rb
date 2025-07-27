require 'rails_helper'

RSpec.describe 'PrinterFlow::GroupRequester', type: :request do
  let(:user) { create(:printer_cloud_user, :with_policies) }
  let!(:group_requester) { create(:group_requester, organization: user.organization) }

  let(:credentials) do
    { 'Authorization' => "Bearer #{user.token}",
      'X-Api-Subdomain' => user.organization.subdomain }
  end

  describe 'POST /v3/printer_flow/group_requesters' do
    let(:create_params) do
      {
        group_requester: {
          name: 'Group 2'
        }
      }
    end

    it 'responds with status ok' do
      post '/v3/printer_flow/group_requesters', params: create_params, headers: credentials

      expect(response).to have_http_status(:created)
    end

    it 'renders a JSON with the requester' do
      post '/v3/printer_flow/group_requesters', params: create_params, headers: credentials

      group_requester_id = JSON.parse(response.body)['id']
      group_requester = ::PrinterFlow::GroupRequester.find(group_requester_id)

      expect(JSON.parse(response.body)).to include(
        'id' => group_requester.id,
        'name' => group_requester.name,
        'parent_group' => nil,
        'parent_group_id' => group_requester.parent_group_id,
        'prn' => group_requester.prn,
        'code' => group_requester.code,
        'status' => group_requester.status,
        'users_count' => group_requester.users.count,
        'created_at' => group_requester.created_at.iso8601(3),
        'updated_at' => group_requester.updated_at.iso8601(3),
        'justification_notes' => []
      )
    end
  end

  describe 'GET /v3/printer_flow/group_requesters' do
    it 'responds with status ok' do
      get '/v3/printer_flow/group_requesters', headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'renders a JSON with all group_requesters' do
      get '/v3/printer_flow/group_requesters', headers: credentials

      expect(JSON.parse(response.body)).to include(
        'printer_flow/group_requesters' => [{
          'id' => group_requester.id,
          'name' => group_requester.name,
          'parent_group_id' => nil,
          'prn' => group_requester.prn,
          'code' => group_requester.code,
          'status' => group_requester.status,
          'users_count' => group_requester.users.count,
          'created_at' => group_requester.created_at.iso8601(3),
          'updated_at' => group_requester.updated_at.iso8601(3)
        }],
        'meta' => {
          'total' => 1
        }
      )
    end
  end

  describe 'GET /v3/printer_flow/group_requesters/:id' do
    it 'responds with status ok' do
      get "/v3/printer_flow/group_requesters/#{group_requester.id}", headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'renders a JSON with the requester' do
      get "/v3/printer_flow/group_requesters/#{group_requester.id}", headers: credentials

      expect(JSON.parse(response.body)).to include(
        'id' => group_requester.id,
        'name' => group_requester.name,
        'parent_group_id' => nil,
        'prn' => group_requester.prn,
        'code' => group_requester.code,
        'status' => group_requester.status,
        'users_count' => group_requester.users.count,
        'created_at' => group_requester.created_at.iso8601(3),
        'updated_at' => group_requester.updated_at.iso8601(3)
      )
    end
  end

  describe 'PUT /v3/printer_flow/group_requesters/:group_requester_id/add_requester' do
    let(:group_requester) { create(:group_requester, organization: user.organization) }
    let(:params) do
      {
        requester_ids: [user.internal_requester.id]
      }
    end

    it 'responds with status ok' do
      put "/v3/printer_flow/group_requesters/#{group_requester.id}/add_requester", params: params, headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it "returns an user group and it's users" do
      put "/v3/printer_flow/group_requesters/#{group_requester.id}/add_requester", params: params, headers: credentials

      batch_operation_id = JSON.parse(response.body)['id']
      batch_operation = ::PrinterAir::BatchOperation.find(batch_operation_id)

      expect(JSON.parse(response.body)).to include(
        'id' => batch_operation.id,
        'ids' => batch_operation.ids,
        'payload' => {
          'group_requester_id' => "#{group_requester.id}"
        },
        'action' => batch_operation.action,
        'record_type' => 'PrinterFlow::GroupRequester',
        'created_by_id' => user.id,
        'status' => batch_operation.status,
        'created_at' => batch_operation.created_at.iso8601(3),
        'updated_at' => batch_operation.updated_at.iso8601(3)
      )
    end
  end

  describe 'PUT /v3/printer_flow/group_requesters/:group_requester_id/remove_requester' do
    let!(:requester_assignment) { create(:requester_assignment, user: user, requester: group_requester) }
    let(:params) do
      {
        requester_id: user.internal_requester.id
      }
    end

    it 'responds with status ok' do
      put "/v3/printer_flow/group_requesters/#{group_requester.id}/remove_requester", params: params,
                                                                                      headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it "returns an user group and it's users" do
      put "/v3/printer_flow/group_requesters/#{group_requester.id}/remove_requester", params: params,
                                                                                      headers: credentials

      expect(JSON.parse(response.body)).to include(
        'id' => group_requester.id,
        'name' => group_requester.name,
        'parent_group_id' => nil,
        'prn' => group_requester.prn,
        'code' => group_requester.code,
        'status' => group_requester.status,
        'users_count' => group_requester.users.count,
        'created_at' => group_requester.created_at.iso8601(3),
        'updated_at' => group_requester.updated_at.iso8601(3)
      )
    end
  end
end
