require 'rails_helper'

RSpec.describe 'PrinterCloud::UserGroup', type: :request do
  let!(:user_group) { create(:printer_cloud_user_group, organization: user.organization) }
  let(:policy) { create(:policy, organization: user.organization) }
  let(:user) { create(:printer_cloud_user, :with_policies) }

  let(:credentials) do
    { 'Authorization' => "Bearer #{user.token}",
      'X-Api-Subdomain' => user.organization.subdomain }
  end

  describe 'PUT /v4/printer_cloud/user_groups/:id/add_users_to_group' do
    let(:params) do
      {
        user_ids: [user.id]
      }
    end

    it 'responds with status ok' do
      put "/v4/printer_cloud/user_groups/#{user_group.id}/add_users_to_group", params: params, headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'creates a batch operation to add users to group' do
      put "/v4/printer_cloud/user_groups/#{user_group.id}/add_users_to_group", params: params, headers: credentials

      user_group.reload

      batch_operation_id = JSON.parse(response.body)['id']
      batch_operation = ::PrinterCloud::BatchOperation.find(batch_operation_id)

      expect(JSON.parse(response.body)).to include(
        'id' => batch_operation.id,
        'record_type' => 'PrinterCloud::UserGroup',
        'action' => batch_operation.action,
        'ids' => batch_operation.ids,
        'status' => batch_operation.status,
        'created_at' => batch_operation.created_at.iso8601(3),
        'updated_at' => batch_operation.updated_at.iso8601(3),
        'payload' => {
          'user_group_id' => batch_operation['payload']['user_group_id']
        },
        'created_by_id' => batch_operation.created_by_id
      )
    end
  end

  describe 'PUT /v4/printer_cloud/user_groups/:id/attach_policies_to_group' do
    let(:params) do
      {
        policy_ids: [policy.id]
      }
    end

    it 'responds with status ok' do
      put "/v4/printer_cloud/user_groups/#{user_group.id}/attach_policies_to_group", params: params,
                                                                                     headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'creates a batch operation to attach policies to group' do
      put "/v4/printer_cloud/user_groups/#{user_group.id}/attach_policies_to_group", params: params,
                                                                                     headers: credentials

      batch_operation_id = JSON.parse(response.body)['id']
      batch_operation = ::PrinterCloud::BatchOperation.find(batch_operation_id)

      expect(JSON.parse(response.body)).to include(
        'id' => batch_operation.id,
        'record_type' => 'PrinterCloud::UserGroup',
        'action' => batch_operation.action,
        'ids' => batch_operation.ids,
        'status' => batch_operation.status,
        'created_at' => batch_operation.created_at.iso8601(3),
        'updated_at' => batch_operation.updated_at.iso8601(3),
        'payload' => {
          'user_group_id' => batch_operation['payload']['user_group_id']
        },
        'created_by_id' => batch_operation.created_by_id
      )
    end
  end
end
