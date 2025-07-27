require 'rails_helper'

RSpec.describe 'PrinterCloud::User', type: :request do
  let(:organization) { create(:organization) }
  let(:user) { create(:printer_cloud_user, :with_policies, organization: organization) }
  let(:policy) { create(:policy, organization: organization) }

  let(:credentials) do
    { 'Authorization' => "Bearer #{user.token}",
      'X-Api-Subdomain' => organization.subdomain }
  end

  describe 'GET /v3/printer_cloud/users' do
    it 'responds with status ok' do
      get '/v3/printer_cloud/users/', headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'renders a JSON response with all users' do
      get '/v3/printer_cloud/users', headers: credentials

      expect(JSON.parse(response.body)).to include(
        'printer_cloud/users' => [
          {
            'id' => user.id,
            'name' => user.name,
            'email' => user.email,
            'cpf' => user.cpf,
            'date_of_birth' => user.date_of_birth.to_s,
            'avatar_url' => user.avatar_url,
            'phone' => user.phone,
            'prn' => user.prn,
            'status' => 'active',
            'username' => user.username,
            'organization_id' => user.organization_id,
            'created_at' => user.created_at.iso8601(3),
            'updated_at' => user.updated_at.iso8601(3),
            'deleted_at' => nil,
            'organizations_count' => 1,
            'user_groups_count' => 0,
            'changed_password' => false,
            'registration_number' => nil
          }
        ],
        'meta' => {
          'total' => 1
        }
      )
    end
  end

  describe 'GET /v3/printer_cloud/users/:id' do
    it 'responds with status ok' do
      get "/v3/printer_cloud/users/#{user.id}", headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'renders a JSON with the user' do
      get "/v3/printer_cloud/users/#{user.id}", headers: credentials
      expect(JSON.parse(response.body)).to include(
        'id' => user.id,
        'name' => user.name,
        'email' => user.email,
        'cpf' => user.cpf,
        'date_of_birth' => user.date_of_birth.to_s,
        'avatar_url' => user.avatar_url,
        'phone' => user.phone,
        'prn' => user.prn,
        'status' => 'active',
        'created_at' => user.created_at.iso8601(3),
        'updated_at' => user.updated_at.iso8601(3),
        'deleted_at' => user.deleted_at,
        'organization_id' => user.organization_id,
        'username' => user.username,
        'registration_number' => user.registration_number,
        'changed_password' => false
      )
    end
  end

  describe 'GET /v3/printer_cloud/me' do
    it 'responds with status ok' do
      get '/v3/printer_cloud/me', headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'renders a JSON with current user' do
      get '/v3/printer_cloud/me', headers: credentials

      expect(JSON.parse(response.body)).to include(
        'id' => user.id,
        'name' => user.name,
        'email' => user.email,
        'cpf' => user.cpf,
        'date_of_birth' => user.date_of_birth.to_s,
        'avatar_url' => user.avatar_url,
        'phone' => user.phone,
        'prn' => user.prn,
        'status' => 'active',
        'created_at' => user.created_at.iso8601(3),
        'updated_at' => user.updated_at.iso8601(3),
        'deleted_at' => user.deleted_at,
        'organization_id' => user.organization_id,
        'username' => user.username,
        'registration_number' => user.registration_number,
        'changed_password' => false,
        'internal_requester' => {
          'birth_date' => user.internal_requester.birth_date.to_s,
          'code' => nil,
          'cpf_cnpj' => user.internal_requester.cpf_cnpj,
          'created_at' => user.internal_requester.created_at.iso8601(3),
          'email' => user.internal_requester.email,
          'id' => user.internal_requester.id,
          'name' => user.internal_requester.name,
          'occupation' => nil,
          'optional_email' => nil,
          'optional_phone' => nil,
          'organization_id' => user.internal_requester.organization_id,
          'parent_group_id' => nil,
          'phone' => user.internal_requester.phone,
          'prn' => user.internal_requester.prn,
          'status' => user.internal_requester.status,
          'type' => user.internal_requester.type,
          'updated_at' => user.internal_requester.updated_at.iso8601(3),
          'blocked' => user.internal_requester.blocked
        }
      )
    end
  end

  describe 'PUT /v3/printer_cloud/users/:id' do
    let(:params) do
      { email: 'contato@printerdobrasil.com.br' }
    end

    it 'responds with status ok' do
      put "/v3/printer_cloud/users/#{user.id}", headers: credentials, params: params

      expect(response).to have_http_status(:ok)
    end

    it 'renders a JSON with updated user' do
      put "/v3/printer_cloud/users/#{user.id}", headers: credentials, params: params

      user.reload

      expect(JSON.parse(response.body)).to include(
        'id' => user.id,
        'name' => user.name,
        'email' => user.email,
        'cpf' => user.cpf,
        'date_of_birth' => user.date_of_birth.to_s,
        'avatar_url' => user.avatar_url,
        'phone' => user.phone,
        'prn' => user.prn,
        'status' => 'active',
        'created_at' => user.created_at.iso8601(3),
        'updated_at' => user.updated_at.iso8601(3),
        'deleted_at' => user.deleted_at,
        'organization_id' => user.organization_id,
        'username' => user.username,
        'registration_number' => user.registration_number,
        'changed_password' => false
      )
    end
  end

  describe 'PUT /v3/printer_cloud/users/:id/deactivate' do
    it 'responds with status ok' do
      put "/v3/printer_cloud/users/#{user.id}/deactivate", headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'renders a JSON with activated user' do
      put "/v3/printer_cloud/users/#{user.id}/deactivate", headers: credentials

      user.reload

      expect(JSON.parse(response.body)).to include(
        'id' => user.id,
        'name' => user.name,
        'email' => user.email,
        'cpf' => user.cpf,
        'date_of_birth' => user.date_of_birth.to_s,
        'avatar_url' => user.avatar_url,
        'phone' => user.phone,
        'prn' => user.prn,
        'status' => user.status,
        'created_at' => user.created_at.iso8601(3),
        'updated_at' => user.updated_at.iso8601(3),
        'deleted_at' => user.deleted_at,
        'organization_id' => user.organization_id,
        'username' => user.username,
        'registration_number' => user.registration_number,
        'changed_password' => false
      )
    end
  end

  describe 'PUT /v3/printer_cloud/users/:id/activate' do
    let(:another_user) { create(:printer_cloud_user, organization: organization, status: :inactive) }

    it 'responds with status ok' do
      put "/v3/printer_cloud/users/#{another_user.id}/activate", headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'renders a JSON with activated user' do
      put "/v3/printer_cloud/users/#{another_user.id}/activate", headers: credentials

      another_user.reload

      expect(JSON.parse(response.body)).to include(
        'id' => another_user.id,
        'name' => another_user.name,
        'email' => another_user.email,
        'cpf' => another_user.cpf,
        'date_of_birth' => another_user.date_of_birth.to_s,
        'avatar_url' => another_user.avatar_url,
        'phone' => another_user.phone,
        'prn' => another_user.prn,
        'status' => another_user.status,
        'created_at' => another_user.created_at.iso8601(3),
        'updated_at' => another_user.updated_at.iso8601(3),
        'deleted_at' => another_user.deleted_at,
        'organization_id' => another_user.organization_id,
        'username' => another_user.username,
        'registration_number' => another_user.registration_number,
        'changed_password' => false
      )
    end
  end

  describe 'PUT /v3/printer_cloud/users/:user_id/update_password' do
    let(:params) do
      {
        current_password: 'Password#123',
        password: '12345678Ab!',
        password_confirmation: '12345678Ab!'
      }
    end

    it 'responds with status ok' do
      put "/v3/printer_cloud/users/#{user.id}/update_password", headers: credentials, params: params

      expect(response).to have_http_status(:ok)
    end

    it 'renders a JSON with the user' do
      put "/v3/printer_cloud/users/#{user.id}/update_password", headers: credentials, params: params

      user.reload

      expect(JSON.parse(response.body)).to include(
        'id' => user.id,
        'name' => user.name,
        'email' => user.email,
        'cpf' => user.cpf,
        'date_of_birth' => user.date_of_birth.to_s,
        'avatar_url' => user.avatar_url,
        'phone' => user.phone,
        'prn' => user.prn,
        'status' => 'active',
        'created_at' => user.created_at.iso8601(3),
        'updated_at' => user.updated_at.iso8601(3),
        'deleted_at' => user.deleted_at,
        'organization_id' => user.organization_id,
        'username' => user.username,
        'registration_number' => user.registration_number,
        'changed_password' => true
      )
    end
  end

  describe 'DELETE /v3/printer_cloud/users/:id' do
    it 'renders a JSON with deleted user' do
      delete "/v3/printer_cloud/users/#{user.id}", headers: credentials

      user.reload

      expect(JSON.parse(response.body)).to include(
        'id' => user.id,
        'name' => user.name,
        'email' => user.email,
        'cpf' => user.cpf,
        'date_of_birth' => user.date_of_birth.to_s,
        'avatar_url' => user.avatar_url,
        'phone' => user.phone,
        'prn' => user.prn,
        'status' => 'active',
        'created_at' => user.created_at.iso8601(3),
        'updated_at' => user.updated_at.iso8601(3),
        'deleted_at' => user.deleted_at.iso8601(3),
        'organization_id' => user.organization_id,
        'username' => user.username,
        'registration_number' => user.registration_number,
        'changed_password' => false
      )
    end
  end

  describe 'PUT /v3/printer_cloud/users/:id/attach_policy' do
    let(:params) do
      {
        policy_ids: [policy.id]
      }
    end
    it 'responds with status ok' do
      put "/v3/printer_cloud/users/#{user.id}/attach_policy", params: params, headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'renders a JSON with updated user' do
      put "/v3/printer_cloud/users/#{user.id}/attach_policy", params: params, headers: credentials
      expect(JSON.parse(response.body)).to include(
        'id' => user.id,
        'name' => user.name,
        'email' => user.email,
        'cpf' => user.cpf,
        'date_of_birth' => user.date_of_birth.to_s,
        'avatar_url' => user.avatar_url,
        'phone' => user.phone,
        'prn' => user.prn,
        'status' => 'active',
        'created_at' => user.created_at.iso8601(3),
        'updated_at' => user.updated_at.iso8601(3),
        'deleted_at' => user.deleted_at,
        'organization_id' => user.organization_id,
        'username' => user.username,
        'registration_number' => user.registration_number,
        'changed_password' => false
      )
    end
  end

  describe 'PUT /v3/printer_cloud/users/:id/detach_policy' do
    let!(:policy_attachment) { create(:policy_attachment, policy_attachable: user, policy: policy) }
    let(:params) do
      {
        policy_id: policy.id
      }
    end

    it 'responds with status ok' do
      put "/v3/printer_cloud/users/#{user.id}/detach_policy", params: params, headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'renders a JSON with updated user' do
      put "/v3/printer_cloud/users/#{user.id}/detach_policy", params: params, headers: credentials
      expect(JSON.parse(response.body)).to include(
        'id' => user.id,
        'name' => user.name,
        'email' => user.email,
        'cpf' => user.cpf,
        'date_of_birth' => user.date_of_birth.to_s,
        'avatar_url' => user.avatar_url,
        'phone' => user.phone,
        'prn' => user.prn,
        'status' => 'active',
        'created_at' => user.created_at.iso8601(3),
        'updated_at' => user.updated_at.iso8601(3),
        'deleted_at' => user.deleted_at,
        'organization_id' => user.organization_id,
        'username' => user.username,
        'registration_number' => user.registration_number,
        'changed_password' => false
      )
    end
  end

  describe 'PUT /v3/printer_cloud/users/:id/add_user_groups' do
    let(:user_group) { create(:printer_cloud_user_group, organization: organization) }
    let(:params) do
      {
        user_group_ids: [user_group.id]
      }
    end

    it 'responds with status ok' do
      put "/v3/printer_cloud/users/#{user.id}/add_user_groups", params: params, headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'renders a JSON with updated user' do
      put "/v3/printer_cloud/users/#{user.id}/add_user_groups", params: params, headers: credentials
      expect(JSON.parse(response.body)).to include(
        'id' => user.id,
        'name' => user.name,
        'email' => user.email,
        'cpf' => user.cpf,
        'date_of_birth' => user.date_of_birth.to_s,
        'avatar_url' => user.avatar_url,
        'phone' => user.phone,
        'prn' => user.prn,
        'status' => 'active',
        'created_at' => user.created_at.iso8601(3),
        'updated_at' => user.updated_at.iso8601(3),
        'deleted_at' => user.deleted_at,
        'organization_id' => user.organization_id,
        'username' => user.username,
        'registration_number' => user.registration_number,
        'changed_password' => false
      )
    end
  end

  describe 'POST /v3/printer_cloud/users' do
    let!(:create_params) do
      { user: { name: 'Aparecido Porfírio dos Santos',
                email: 'contato@printerdobrasil.com.br',
                username: 'user.name',
                cpf: '11404702997',
                date_of_birth: '22/02/2023',
                phone: '41988888889' } }
    end

    it 'responds with status ok' do
      post '/v3/printer_cloud/users', params: create_params, headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'renders a JSON with deleted user' do
      post '/v3/printer_cloud/users', params: create_params, headers: credentials
      created_user_id = JSON.parse(response.body)['id']
      created_user = PrinterCloud::User.find(created_user_id)

      expect(JSON.parse(response.body)).to include(
        'id' => created_user.id,
        'name' => created_user.name,
        'email' => created_user.email,
        'cpf' => created_user.cpf,
        'date_of_birth' => created_user.date_of_birth.to_s,
        'avatar_url' => created_user.avatar_url,
        'phone' => created_user.phone,
        'prn' => created_user.prn,
        'status' => created_user.status,
        'created_at' => created_user.created_at.iso8601(3),
        'updated_at' => created_user.updated_at.iso8601(3),
        'deleted_at' => nil,
        'organization_id' => created_user.organization_id,
        'username' => created_user.username,
        'registration_number' => created_user.registration_number,
        'changed_password' => created_user.changed_password
      )
    end
  end

  describe 'PATCH /v3/printer_cloud/users/:user_id/send_random_password' do
    let(:params) do
      {
        notification: 'sms'
      }
    end
    it 'responds with status ok' do
      patch "/v3/printer_cloud/users/#{user.id}/send_random_password", params: params, headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'returns the user with random password sended' do
      patch "/v3/printer_cloud/users/#{user.id}/send_random_password", params: params, headers: credentials

      user.reload

      expect(JSON.parse(response.body)).to include(
        'id' => user.id,
        'name' => user.name,
        'email' => user.email,
        'cpf' => user.cpf,
        'date_of_birth' => user.date_of_birth.to_s,
        'avatar_url' => user.avatar_url,
        'phone' => user.phone,
        'prn' => user.prn,
        'status' => 'active',
        'created_at' => user.created_at.iso8601(3),
        'updated_at' => user.updated_at.iso8601(3),
        'deleted_at' => user.deleted_at,
        'organization_id' => user.organization_id,
        'username' => user.username,
        'registration_number' => user.registration_number,
        'changed_password' => false
      )
    end
  end
end
