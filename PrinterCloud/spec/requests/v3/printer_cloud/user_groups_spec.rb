require 'rails_helper'

RSpec.describe 'PrinterCloud::UserGroup', type: :request do
  let!(:user_group) { create(:printer_cloud_user_group, organization: user.organization) }
  let(:policy) { create(:policy, organization: user.organization) }
  let(:user) { create(:printer_cloud_user, :with_policies) }

  let(:credentials) do
    { 'Authorization' => "Bearer #{user.token}",
      'X-Api-Subdomain' => user.organization.subdomain }
  end

  describe 'GET /v3/printer_cloud/user_groups' do
    it 'responds with status ok' do
      get '/v3/printer_cloud/user_groups', headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'returns all user groups' do
      get '/v3/printer_cloud/user_groups', headers: credentials

      expect(JSON.parse(response.body)).to include(
        'printer_cloud/user_groups' => [
          {
            'id' => user_group.id,
            'name' => user_group.name,
            'description' => 'description',
            'organization_id' => user_group.organization_id,
            'prn' => user_group.prn,
            'status' => 'active',
            'users_count' => 0,
            'policies_count' => user_group.policies_count,
            'organization' => {
              'corporate_name' => user_group.organization.corporate_name
            },
            'created_at' => user_group.created_at.iso8601(3),
            'updated_at' => user_group.updated_at.iso8601(3)
          }
        ],
        'meta' => {
          'total' => 1
        }
      )
    end
  end

  describe 'GET /v3/printer_cloud/user_groups/:id' do
    it 'responds with status ok' do
      get "/v3/printer_cloud/user_groups/#{user_group.id}", headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it "returns an user group and it's users" do
      get "/v3/printer_cloud/user_groups/#{user_group.id}", headers: credentials

      expect(JSON.parse(response.body)).to include(
        'id' => user_group.id,
        'name' => user_group.name,
        'description' => 'description',
        'users_count' => 0,
        'organization_id' => user_group.organization_id,
        'prn' => user_group.prn,
        'status' => 'active',
        'organization' => { 'corporate_name' => user_group.organization.corporate_name },
        'created_at' => user_group.created_at.iso8601(3),
        'updated_at' => user_group.updated_at.iso8601(3),
        'policies_count' => 0
      )
    end
  end

  describe 'POST /v3/printer_cloud/user_groups/' do
    let(:params) do
      {
        user_group: {
          name: 'design-team',
          description: 'Group to set Printer Air permissions to design team.',
          organization_id: user.organization_id
        }
      }
    end

    it 'responds with status ok' do
      post '/v3/printer_cloud/user_groups', params: params, headers: credentials

      expect(response).to have_http_status(:created)
    end

    it 'returns the created user group' do
      post '/v3/printer_cloud/user_groups', params: params, headers: credentials

      user_group_id = JSON.parse(response.body)['id']
      user_group = PrinterCloud::UserGroup.find(user_group_id)

      expect(JSON.parse(response.body)).to include(
        'id' => user_group.id,
        'name' => user_group.name,
        'description' => 'Group to set Printer Air permissions to design team.',
        'users_count' => 0,
        'organization_id' => user_group.organization_id,
        'prn' => user_group.prn,
        'status' => 'active',
        'organization' => {
          'corporate_name' => user_group.organization.corporate_name
        },
        'created_at' => user_group.created_at.iso8601(3),
        'updated_at' => user_group.updated_at.iso8601(3),
        'policies_count' => 0
      )
    end
  end

  describe 'PUT /v3/printer_cloud/user_groups/:id' do
    let(:params) do
      {
        user_group: {
          name: 'product-team',
          description: 'Group with users from product team.'
        }
      }
    end

    it 'responds with status ok' do
      put "/v3/printer_cloud/user_groups/#{user_group.id}", params: params, headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it "returns an user group and it's users" do
      put "/v3/printer_cloud/user_groups/#{user_group.id}", params: params, headers: credentials

      user_group.reload

      expect(JSON.parse(response.body)).to include(
        'id' => user_group.id,
        'name' => user_group.name,
        'description' => 'Group with users from product team.',
        'users_count' => 0,
        'organization_id' => user_group.organization_id,
        'prn' => user_group.prn,
        'status' => 'active',
        'organization' => {
          'corporate_name' => user_group.organization.corporate_name
        },
        'created_at' => user_group.created_at.iso8601(3),
        'updated_at' => user_group.updated_at.iso8601(3),
        'policies_count' => 0
      )
    end
  end

  describe 'PUT /v3/printer_cloud/user_groups/:id/activate' do
    let(:user_group) { create(:printer_cloud_user_group, status: :inactive, organization: user.organization) }

    it 'responds with status ok' do
      put "/v3/printer_cloud/user_groups/#{user_group.id}/activate", headers: credentials
      expect(response).to have_http_status(:ok)
    end

    it "returns an user group and it's users" do
      put "/v3/printer_cloud/user_groups/#{user_group.id}/activate", headers: credentials

      user_group.reload

      expect(JSON.parse(response.body)).to include(
        'id' => user_group.id,
        'name' => user_group.name,
        'description' => 'description',
        'users_count' => 0,
        'organization_id' => user_group.organization_id,
        'prn' => user_group.prn,
        'status' => 'active',
        'organization' => {
          'corporate_name' => user_group.organization.corporate_name
        },
        'created_at' => user_group.created_at.iso8601(3),
        'updated_at' => user_group.updated_at.iso8601(3),
        'policies_count' => 0
      )
    end
  end

  describe 'PUT /v3/printer_cloud/user_groups/:id/deactivate' do
    it 'responds with status ok' do
      put "/v3/printer_cloud/user_groups/#{user_group.id}/deactivate", headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it "returns an user group and it's users" do
      put "/v3/printer_cloud/user_groups/#{user_group.id}/deactivate", headers: credentials

      user_group.reload

      expect(JSON.parse(response.body)).to include(
        'id' => user_group.id,
        'name' => user_group.name,
        'description' => 'description',
        'users_count' => 0,
        'organization_id' => user_group.organization_id,
        'prn' => user_group.prn,
        'status' => 'inactive',
        'organization' => {
          'corporate_name' => user_group.organization.corporate_name
        },
        'created_at' => user_group.created_at.iso8601(3),
        'updated_at' => user_group.updated_at.iso8601(3),
        'policies_count' => 0
      )
    end
  end

  describe 'DELETE /v3/printer_cloud/user_groups/:id' do
    it 'responds with status ok' do
      delete "/v3/printer_cloud/user_groups/#{user_group.id}", headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it "returns an user group and it's users" do
      delete "/v3/printer_cloud/user_groups/#{user_group.id}", headers: credentials

      expect(JSON.parse(response.body)).to include(
        'id' => user_group.id,
        'name' => user_group.name,
        'users_count' => 0,
        'description' => 'description',
        'organization_id' => user_group.organization_id,
        'prn' => user_group.prn,
        'status' => 'active',
        'organization' => {
          'corporate_name' => user_group.organization.corporate_name
        },
        'created_at' => user_group.created_at.iso8601(3),
        'updated_at' => user_group.updated_at.iso8601(3),
        'policies_count' => 0
      )
    end
  end

  describe 'PUT /v3/printer_cloud/user_groups/:id/remove_user' do
    let!(:user_group_assignment) { create(:user_group_assignment, user: user, user_group: user_group) }
    let(:params) do
      {
        user_id: user.id
      }
    end

    it 'responds with status ok' do
      put "/v3/printer_cloud/user_groups/#{user_group.id}/remove_user", params: params, headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'returns an user group updated' do
      put "/v3/printer_cloud/user_groups/#{user_group.id}/remove_user", params: params, headers: credentials

      user_group.reload

      expect(JSON.parse(response.body)).to include(
        'id' => user_group.id,
        'name' => user_group.name,
        'description' => 'description',
        'users_count' => 0,
        'organization_id' => user_group.organization_id,
        'prn' => user_group.prn,
        'status' => 'active',
        'created_at' => user_group.created_at.iso8601(3),
        'updated_at' => user_group.updated_at.iso8601(3),
        'policies_count' => 0
      )
    end
  end

  describe 'PUT /v3/printer_cloud/user_groups/:id/add_user' do
    let(:params) do
      {
        user_id: user.id
      }
    end

    it 'responds with status ok' do
      put "/v3/printer_cloud/user_groups/#{user_group.id}/add_user", params: params, headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it "returns an user group and it's users" do
      put "/v3/printer_cloud/user_groups/#{user_group.id}/add_user", params: params, headers: credentials

      user_group.reload

      expect(JSON.parse(response.body)).to include(
        'id' => user_group.id,
        'name' => user_group.name,
        'description' => 'description',
        'users_count' => 1,
        'organization_id' => user_group.organization_id,
        'prn' => user_group.prn,
        'status' => 'active',
        'organization' => {
          'corporate_name' => user_group.organization.corporate_name
        },
        'created_at' => user_group.created_at.iso8601(3),
        'updated_at' => user_group.updated_at.iso8601(3),
        'policies_count' => 0
      )
    end
  end

  describe 'PUT /v3/printer_cloud/user_groups/:id/attach_policy' do
    let(:params) do
      {
        policy_ids: [policy.id]
      }
    end

    it 'responds with status ok' do
      put "/v3/printer_cloud/user_groups/#{user_group.id}/attach_policy", params: params, headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it "returns an user group and it's users" do
      put "/v3/printer_cloud/user_groups/#{user_group.id}/attach_policy", params: params, headers: credentials

      expect(JSON.parse(response.body)).to include(
        'id' => user_group.id,
        'name' => user_group.name,
        'description' => 'description',
        'users_count' => user_group.users.count,
        'policies_count' => user_group.policies_count,
        'organization_id' => user_group.organization_id,
        'prn' => user_group.prn,
        'status' => 'active',
        'organization' => {
          'corporate_name' => user_group.organization.corporate_name
        },
        'created_at' => user_group.created_at.iso8601(3),
        'updated_at' => user_group.updated_at.iso8601(3)
      )
    end
  end

  describe 'PUT /v3/printer_cloud/user_groups/:id/detach_policy' do
    let!(:policy_attachment) { create(:policy_attachment, policy_attachable: user_group, policy: policy) }

    let(:params) do
      {
        policy_id: policy.id
      }
    end

    it 'responds with status ok' do
      put "/v3/printer_cloud/user_groups/#{user_group.id}/detach_policy", params: params, headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it "returns an user group and it's users" do
      put "/v3/printer_cloud/user_groups/#{user_group.id}/detach_policy", params: params, headers: credentials

      user_group.reload

      expect(JSON.parse(response.body)).to include(
        'id' => user_group.id,
        'name' => user_group.name,
        'description' => 'description',
        'users_count' => user_group.users.count,
        'organization_id' => user_group.organization_id,
        'prn' => user_group.prn,
        'status' => 'active',
        'organization' => {
          'corporate_name' => user_group.organization.corporate_name
        },
        'created_at' => user_group.created_at.iso8601(3),
        'updated_at' => user_group.updated_at.iso8601(3)
      )
    end
  end
end
