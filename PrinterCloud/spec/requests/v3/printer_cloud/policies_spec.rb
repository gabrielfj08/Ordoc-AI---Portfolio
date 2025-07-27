require 'rails_helper'

RSpec.describe 'PrinterCloud::Policy', type: :request do
  let!(:policy) { create(:policy, organization: user.organization) }
  let(:policy_action) { PrinterCloud::PolicyAction.last }
  let(:user) { create(:printer_cloud_user, :with_policy_for_policies) }

  let(:credentials) do
    { 'Authorization' => "Bearer #{user.token}",
      'X-Api-Subdomain' => user.organization.subdomain }
  end

  describe 'GET v3/printer_cloud/policies' do
    it 'responds with status ok' do
      get '/v3/printer_cloud/policies', headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'returns all policies' do
      get '/v3/printer_cloud/policies', headers: credentials

      expect(JSON.parse(response.body)).to include(
        'printer_cloud/policies' => [{
          'id' => policy.id,
          'name' => policy.name,
          'prn' => policy.prn,
          'effect' => 'allow',
          'resource' => policy.resource,
          'organization_id' => policy.organization_id,
          'created_at' => policy.created_at.iso8601(3),
          'updated_at' => policy.updated_at.iso8601(3),
          'description' => 'description',
          'source' => 'customer_managed',
          'service' => 'printer_cloud',
          'user_groups_count' => 0,
          'users_count' => 0,
          'organization' => {
            'corporate_name' => policy.organization.corporate_name
          }
        }, {
          'id' => user.policies.first.id,
          'name' => user.policies.first.name,
          'prn' => user.policies.first.prn,
          'effect' => 'allow',
          'resource' => user.policies.first.resource,
          'organization_id' => user.policies.first.organization_id,
          'created_at' => user.policies.first.created_at.iso8601(3),
          'updated_at' => user.policies.first.updated_at.iso8601(3),
          'description' => 'description',
          'source' => 'customer_managed',
          'service' => 'printer_cloud',
          'user_groups_count' => 0,
          'users_count' => 1,
          'organization' => {
            'corporate_name' => user.policies.first.organization.corporate_name
          }
        }],
        'meta' => {
          'total' => 2
        }
      )
    end
  end

  describe 'GET v3/printer_cloud/policies/:id' do
    it 'responds with status ok' do
      get "/v3/printer_cloud/policies/#{policy.id}", headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'returns a policy' do
      get "/v3/printer_cloud/policies/#{policy.id}", headers: credentials

      expect(JSON.parse(response.body)).to include(
        'id' => policy.id,
        'name' => policy.name,
        'prn' => policy.prn,
        'effect' => 'allow',
        'resource' => policy.resource,
        'organization_id' => policy.organization_id,
        'created_at' => policy.created_at.iso8601(3),
        'updated_at' => policy.updated_at.iso8601(3),
        'description' => 'description',
        'user_groups_count' => 0,
        'users_count' => 0,
        'source' => 'customer_managed',
        'service' => 'printer_cloud',
        'organization' => {
          'cnpj' => policy.organization.cnpj,
          'corporate_name' => policy.organization.corporate_name
        },
        'actions' => []
      )
    end
  end

  describe 'POST v3/printer_cloud/policies/' do
    let(:params) do
      {
        policy: {
          name: 'crud-usuarios',
          organization_id: user.organization_id,
          effect: 'allow',
          resource: [
            "prn:printer_cloud:#{user.organization.cnpj}:user/*"
          ],
          description: 'description',
          action_ids: [policy_action.id],
          service: 'printer_cloud'
        }
      }
    end

    it 'responds with status created' do
      post '/v3/printer_cloud/policies', headers: credentials, params: params
      expect(response).to have_http_status(:created)
    end

    it 'returns the created policy' do
      post '/v3/printer_cloud/policies', headers: credentials, params: params

      policy_id = JSON.parse(response.body)['id']
      policy = ::PrinterCloud::Policy.find(policy_id)

      expect(JSON.parse(response.body)).to include(
        'id' => policy.id,
        'name' => policy.name,
        'prn' => policy.prn,
        'effect' => 'allow',
        'organization' => {
          'cnpj' => policy.organization.cnpj,
          'corporate_name' => policy.organization.corporate_name
        },
        'actions' => [
          'access_level' => policy_action.access_level,
          'action' => policy_action.action,
          'id' => policy_action.id,
          'label' => policy_action.label,
          'resource' => policy_action.resource,
          'service' => policy_action.service,
          'translated_resource' => 'Usuários'
        ],
        'resource' => policy.resource,
        'service' => 'printer_cloud',
        'user_groups_count' => 0,
        'users_count' => 0,
        'organization_id' => policy.organization_id,
        'created_at' => policy.created_at.iso8601(3),
        'updated_at' => policy.updated_at.iso8601(3),
        'description' => 'description',
        'source' => 'customer_managed'
      )
    end
  end

  describe 'PUT v3/printer_cloud/policies/:id' do
    let(:params) do
      {
        policy: {
          name: 'deny-crud-directories',
          effect: 'deny',
          action_ids: [policy_action.id]
        }
      }
    end

    it 'responds with status ok' do
      put "/v3/printer_cloud/policies/#{policy.id}", headers: credentials, params: params

      expect(response).to have_http_status(:ok)
    end

    it 'returns the updated policy' do
      put "/v3/printer_cloud/policies/#{policy.id}", headers: credentials, params: params

      policy.reload

      expect(JSON.parse(response.body)).to include(
        'id' => policy.id,
        'name' => policy.name,
        'prn' => policy.prn,
        'effect' => 'deny',
        'actions' => [{
          'access_level' => policy_action.access_level,
          'action' => policy_action.action,
          'id' => policy_action.id,
          'label' => policy_action.label,
          'resource' => policy_action.resource,
          'service' => policy_action.service,
          'translated_resource' => 'Usuários'
        }],
        'resource' => policy.resource,
        'organization_id' => policy.organization_id,
        'created_at' => policy.created_at.iso8601(3),
        'updated_at' => policy.updated_at.iso8601(3),
        'description' => 'description',
        'source' => 'customer_managed',
        'service' => 'printer_cloud',
        'user_groups_count' => 0,
        'users_count' => 0,
        'organization' => {
          'cnpj' => policy.organization.cnpj,
          'corporate_name' => policy.organization.corporate_name
        }
      )
    end
  end

  describe 'DELETE v3/printer_cloud/policies/:id' do
    it 'responds with status ok' do
      delete "/v3/printer_cloud/policies/#{policy.id}", headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'returns the deleted policy' do
      delete "/v3/printer_cloud/policies/#{policy.id}", headers: credentials

      expect(JSON.parse(response.body)).to include(
        'id' => policy.id,
        'name' => policy.name,
        'prn' => policy.prn,
        'effect' => 'allow',
        'actions' => [],
        'resource' => policy.resource,
        'organization_id' => policy.organization_id,
        'created_at' => policy.created_at.iso8601(3),
        'updated_at' => policy.updated_at.iso8601(3),
        'description' => 'description',
        'source' => 'customer_managed',
        'service' => 'printer_cloud',
        'organization' => {
          'cnpj' => policy.organization.cnpj,
          'corporate_name' => policy.organization.corporate_name
        },
        'user_groups_count' => policy.user_groups_count,
        'users_count' => policy.users_count
      )
    end
  end

  describe 'PUT v3/printer_cloud/policies/:id/attach_policy_to_groups' do
    let(:user_group) { create(:user_group, organization: user.organization) }
    let(:params) do
      {
        user_group_ids: [user_group.id],
        policy_ids: [policy.id]
      }
    end

    it 'responds with status ok' do
      put "/v3/printer_cloud/policies/#{policy.id}/attach_policy_to_user_groups", headers: credentials,
                                                                                  params: params

      expect(response).to have_http_status(:ok)
    end

    it 'returns the policy' do
      put "/v3/printer_cloud/policies/#{policy.id}/attach_policy_to_user_groups", headers: credentials,
                                                                                  params: params

      policy.reload

      expect(JSON.parse(response.body)).to include(
        'id' => policy.id,
        'name' => policy.name,
        'organization' => {
          'cnpj' => policy.organization.cnpj,
          'corporate_name' => policy.organization.corporate_name
        },
        'prn' => policy.prn,
        'effect' => 'allow',
        'actions' => [],
        'resource' => policy.resource,
        'organization_id' => policy.organization_id,
        'created_at' => policy.created_at.iso8601(3),
        'updated_at' => policy.updated_at.iso8601(3),
        'description' => 'description',
        'source' => 'customer_managed',
        'service' => 'printer_cloud',
        'user_groups_count' => 0,
        'users_count' => 0
      )
    end
  end
  describe 'PUT v3/printer_cloud/policies/:id/attach_policy_to_user' do
    let(:policy) do
      create(:policy, organization: user.organization,
                      resource: ["prn:printer_cloud:#{user.organization.cnpj}:*"])
    end
    let(:params) do
      {
        user_id: [user.id],
        policy_ids: [policy.id]
      }
    end

    it 'responds with status ok' do
      put "/v3/printer_cloud/policies/#{policy.id}/attach_policy_to_user", headers: credentials,
                                                                           params: params

      expect(response).to have_http_status(:ok)
    end

    it 'returns the policy' do
      put "/v3/printer_cloud/policies/#{policy.id}/attach_policy_to_user", headers: credentials,
                                                                           params: params

      policy.reload

      expect(JSON.parse(response.body)).to include(
        'id' => policy.id,
        'name' => policy.name,
        'prn' => policy.prn,
        'effect' => 'allow',
        'actions' => [],
        'resource' => policy.resource,
        'organization_id' => policy.organization_id,
        'created_at' => policy.created_at.iso8601(3),
        'updated_at' => policy.updated_at.iso8601(3),
        'description' => 'description',
        'user_groups_count' => 0,
        'users_count' => 1,
        'source' => 'customer_managed',
        'service' => 'printer_cloud',
        'organization' => {
          'cnpj' => policy.organization.cnpj,
          'corporate_name' => policy.organization.corporate_name
        }
      )
    end
  end
end
