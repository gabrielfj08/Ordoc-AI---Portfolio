require 'rails_helper'

RSpec.describe 'PrinterCloud::PolicyAttachment', type: :request do
  let(:user) { create(:printer_cloud_user, :with_policy_for_policies) }
  let(:policy) { user.policies.first }

  let(:credentials) do
    { 'Authorization' => "Bearer #{user.token}",
      'X-Api-Subdomain' => user.organization.subdomain }
  end

  describe 'GET /v3/printer_cloud/policies/:id/policy_attachments' do
    it 'responds with status ok' do
      get "/v3/printer_cloud/policies/#{policy.id}/policy_attachments", headers: credentials
      expect(response).to have_http_status(:ok)
    end

    it "returns the policy attachments with it's objects" do
      get "/v3/printer_cloud/policies/#{policy.id}/policy_attachments", headers: credentials

      expect(JSON.parse(response.body)).to include(
        'printer_cloud/policy_attachments' => [
          {
            'id' => policy.policy_attachments.first.id,
            'policy_attachable_type' => 'PrinterCloud::User',
            'policy_attachable' => {
              'id' => policy.policy_attachments.first.policy_attachable.id,
              'name' => policy.policy_attachments.first.policy_attachable.name
            }
          }
        ],
        'meta' => {
          'total' => 1
        }
      )
    end
  end
end
