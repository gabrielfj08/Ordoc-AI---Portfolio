require 'rails_helper'

RSpec.describe 'Users', type: :request do
  let(:user) { create(:user, :admin) }
  let(:authorization_headers) do
    { 'Authorization' => "Bearer #{user.token}" }
  end

  describe 'GET /users' do
    it 'returns the list of users' do
      get '/users', :headers => authorization_headers

      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body)).to match_array([
        include(
          'id' => user.id,
          'cpf' => user.cpf,
          'name' => user.name,
          'email' => user.email,
          'phone' => user.phone,
          'date_of_birth' => user.date_of_birth.to_s
        )
      ])
    end
  end

  describe 'GET /users/:id' do
    it 'returns the user' do
      get "/users/#{user.id}", :headers => authorization_headers

      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body)).to include(
        'id' => user.id,
        'cpf' => user.cpf,
        'name' => user.name,
        'email' => user.email,
        'phone' => user.phone,
        'date_of_birth' => user.date_of_birth.to_s,
        'roles' => [{
          'id' => user.roles.first.id,
          'type' =>  'ADMIN',
          'user_id' =>  user.roles.first.user_id,
          'organization_id' =>  user.roles.first.organization_id,
          'department_id' =>  user.roles.first.department_id,
          'created_at' =>  user.roles.first.created_at.iso8601(3),
          'updated_at' =>  user.roles.first.updated_at.iso8601(3)
        }],
        'created_at' => user.created_at.iso8601(3),
        'updated_at' => user.updated_at.iso8601(3),
        'sign_in_count' => user.sign_in_count,
        'current_sign_in_at' => nil,
        'last_sign_in_at' => nil,
        'current_sign_in_ip' => nil,
        'last_sign_in_ip' => nil
      )
    end
  end

  describe 'PUT /users/:id' do
    let(:cpf) { CPF.generate }
    let(:update_params) do
      {
        user: {
          name: 'Jhonny',
          email: 'test@example.com',
          cpf: cpf
        }
      }
    end

    it 'returns the updated user' do
      put "/users/#{user.id}", :headers => authorization_headers, :params => update_params

      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body)).to include(
        'name' => 'Jhonny',
        'cpf' => cpf
      )
    end
  end

  describe 'DELETE /users/:id' do
    let!(:user) { create(:user, :admin) }
    
    it 'deletes the user' do
      expect do
        delete "/users/#{user.id}", :headers => authorization_headers
      end.to change{ User.kept.count }.by(-1)
    end

    it 'returns the deleted user' do
      delete "/users/#{user.id}", :headers => authorization_headers

      user.reload

      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body)).to include(
        'id' => user.id,
        'cpf' => user.cpf,
        'name' => user.name,
        'email' => user.email,
        'phone' => user.phone,
        'date_of_birth' => user.date_of_birth.to_s,
        'roles' => [],
        'created_at' => user.created_at.iso8601(3),
        'updated_at' => user.updated_at.iso8601(3),
        'sign_in_count' => user.sign_in_count,
        'current_sign_in_at' => nil,
        'last_sign_in_at' => nil,
        'current_sign_in_ip' => nil,
        'last_sign_in_ip' => nil
      )
    end
  end

  describe 'DELETE /users/:id/really_destroy' do
    let!(:user) { create(:user, :admin) }
    let!(:user2) { create(:user, deleted_at: '2022-02-02 17:49:30.192711208 +0000') }
    
    it 'really destroy user' do
      expect do
        delete "/users/#{user2.id}/really_destroy", :headers => authorization_headers
      end.to change{ User.count }.by(-1)
    end

    it 'returns the destroyed user' do
      delete "/users/#{user2.id}/really_destroy", :headers => authorization_headers

      expect(JSON.parse(response.body)).to include(
        'id' => user2.id,
        'cpf' => user2.cpf,
        'name' => user2.name,
        'email' => user2.email,
        'phone' => user2.phone,
        'date_of_birth' => user2.date_of_birth.to_s,
        'roles' => [],
        'created_at' => user2.created_at.iso8601(3),
        'updated_at' => user2.updated_at.iso8601(3),
        'sign_in_count' => user2.sign_in_count,
        'current_sign_in_at' => nil,
        'last_sign_in_at' => nil,
        'current_sign_in_ip' => nil,
        'last_sign_in_ip' => nil
      )
    end
  end

  describe 'PATCH /users/:id/restore' do
    let!(:user) { create(:user, :admin) }
    let!(:user2) { create(:user, deleted_at: '2022-02-02 17:49:30.192711208 +0000') }

    it 'restores the user' do
      expect do
        patch "/users/#{user2.id}/restore", :headers => authorization_headers
      end.to change{ User.kept.count }.by(+1)
    end

    it 'returns the restored user' do
      patch "/users/#{user2.id}/restore", :headers => authorization_headers

      user2.reload

      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body)).to include(
        'id' => user2.id,
        'cpf' => user2.cpf,
        'name' => user2.name,
        'email' => user2.email,
        'phone' => user2.phone,
        'date_of_birth' => user2.date_of_birth.to_s,
        'roles' => [],
        'created_at' => user2.created_at.iso8601(3),
        'updated_at' => user2.updated_at.iso8601(3),
        'sign_in_count' => user2.sign_in_count,
        'current_sign_in_at' => nil,
        'last_sign_in_at' => nil,
        'current_sign_in_ip' => nil,
        'last_sign_in_ip' => nil
      )
    end
  end
end
