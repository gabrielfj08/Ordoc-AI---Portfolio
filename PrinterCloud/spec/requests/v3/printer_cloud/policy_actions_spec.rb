require 'rails_helper'

RSpec.describe 'PrinterCloud::PolicyAction', type: :request do
  let!(:policy_action) { create(:policy_action, :user_group) }
  let(:user) { create(:printer_cloud_user) }

  let(:credentials) do
    { 'Authorization' => "Bearer #{user.token}",
      'X-Api-Subdomain' => user.organization.subdomain }
  end

  describe 'GET v3/printer_cloud/policy_actions' do
    it 'responds with status ok' do
      get '/v3/printer_cloud/policy_actions', headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'returns all policy actions' do
      get '/v3/printer_cloud/policy_actions', headers: credentials

      expect(JSON.parse(response.body)).to include(
        'printer_cloud/policy_actions' => [{
          'id' => policy_action.id,
          'resource' => policy_action.resource,
          'access_level' => policy_action.access_level,
          'action' => policy_action.action,
          'label' => policy_action.label,
          'service' => policy_action.service,
          'created_at' => policy_action.created_at.iso8601(3),
          'updated_at' => policy_action.updated_at.iso8601(3),
          'translated_resource' => 'Grupos'
        }],
        'meta' => {
          'total' => 1
        }
      )
    end
  end
end
