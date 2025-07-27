require 'rails_helper'

RSpec.describe 'PrinterCloud::Policy', type: :request do
  let!(:policy) { create(:policy, organization: user.organization) }
  let(:user) { create(:printer_cloud_user, :with_policy_for_policies) }

  let(:credentials) do
    { 'Authorization' => "Bearer #{user.token}",
      'X-Api-Subdomain' => user.organization.subdomain }
  end

  describe 'PUT v4/printer_cloud/policies/:id/attach_policy_to_user_groups' do
    let(:user_group) { create(:printer_cloud_user_group, organization: user.organization) }
    let(:params) do
      {
        user_group_ids: [user_group.id]
      }
    end

    it 'responds with status ok' do
      put "/v4/printer_cloud/policies/#{policy.id}/attach_policy_to_user_groups", headers: credentials,
                                                                                  params: params

      expect(response).to have_http_status(:ok)
    end

    it 'creates a batch operation to add  user groups to policy' do
      put "/v4/printer_cloud/policies/#{policy.id}/attach_policy_to_user_groups", headers: credentials,
                                                                                  params: params

      batch_operation_id = JSON.parse(response.body)['id']
      batch_operation = ::PrinterCloud::BatchOperation.find(batch_operation_id)

      expect(JSON.parse(response.body)).to include(
        'id' => batch_operation.id,
        'record_type' => 'PrinterCloud::Policy',
        'action' => batch_operation.action,
        'ids' => batch_operation.ids,
        'status' => batch_operation.status,
        'created_at' => batch_operation.created_at.iso8601(3),
        'updated_at' => batch_operation.updated_at.iso8601(3),
        'payload' => {
          'policy_id' => batch_operation['payload']['policy_id']
        },
        'created_by_id' => batch_operation.created_by_id
      )
    end
  end
  describe 'PUT v4/printer_cloud/policies/:id/attach_policy_to_users' do
    let(:policy) do
      create(:policy, organization: user.organization,
                      resource: ["prn:printer_cloud:#{user.organization.cnpj}:*"])
    end
    let(:params) do
      {
        user_ids: [user.id]
      }
    end

    it 'responds with status ok' do
      put "/v4/printer_cloud/policies/#{policy.id}/attach_policy_to_users", headers: credentials,
                                                                            params: params

      expect(response).to have_http_status(:ok)
    end

    it 'creates a batch operation to add users to policy' do
      put "/v4/printer_cloud/policies/#{policy.id}/attach_policy_to_users", headers: credentials,
                                                                            params: params

      batch_operation_id = JSON.parse(response.body)['id']
      batch_operation = ::PrinterCloud::BatchOperation.find(batch_operation_id)

      expect(JSON.parse(response.body)).to include(
        'id' => batch_operation.id,
        'record_type' => 'PrinterCloud::Policy',
        'action' => batch_operation.action,
        'ids' => batch_operation.ids,
        'status' => batch_operation.status,
        'created_at' => batch_operation.created_at.iso8601(3),
        'updated_at' => batch_operation.updated_at.iso8601(3),
        'payload' => {
          'policy_id' => batch_operation['payload']['policy_id']
        },
        'created_by_id' => batch_operation.created_by_id
      )
    end
  end
end
