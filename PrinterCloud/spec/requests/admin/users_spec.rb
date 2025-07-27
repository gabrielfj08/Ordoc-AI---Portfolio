require 'rails_helper'

RSpec.describe "Users", type: :request do
  let(:admin) { create(:user, :admin) }
  let(:user) { create(:user, :organization_manager) }

  let(:authorization_headers) do
    { 'Authorization' => "Bearer #{admin.token}" }
  end

  describe 'DELETE /users/:id' do
    it 'should return deleted user' do

      delete "/users/#{user.id}", headers: authorization_headers

      expect(JSON.parse(response.body)).to include('id' => user.id,
                                                   'email' => user.email,
                                                   'name' => user.name,
                                                   'phone' => user.phone)  
    end
  end

  describe 'SHOW /users/:id' do
    it 'returns the user' do
      get "/users/#{user.id}", headers: authorization_headers

      expect(JSON.parse(response.body)).to include('cpf' => user.cpf)
    end
  end
end
