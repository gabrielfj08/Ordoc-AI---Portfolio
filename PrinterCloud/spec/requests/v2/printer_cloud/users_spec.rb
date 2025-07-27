require 'rails_helper'

RSpec.describe 'Users', type: :request do
  let!(:authorization_headers) do
    { 'Authorization' => "Bearer #{user.token}" }
  end

  describe 'GET /v2/printer_cloud/me' do
    let(:user) { create(:user) }

    it 'responds with status ok' do
      get '/v2/printer_cloud/me', headers: authorization_headers

      expect(response).to have_http_status(:ok)
    end

    it 'renders a JSON with current user' do
      get '/v2/printer_cloud/me', headers: authorization_headers

      expect(JSON.parse(response.body)).to include(
        'id' => user.id,
        'email' => user.email,
        'created_at' => user.created_at.iso8601(3),
        'updated_at' => user.updated_at.iso8601(3),
        'name' => user.name,
        'phone' => user.phone,
        'cpf' => user.cpf,
        'date_of_birth' => '2021-01-15',
        'status' => 'active',
        'avatar_url' => user.avatar_url
      )
    end

    describe 'GET /v2/printer_cloud/me/profiles' do
      let(:user) { create(:user, :admin, :organization_manager) }

      it 'responds with status ok' do
        get '/v2/printer_cloud/me/profiles', headers: authorization_headers

        expect(response).to have_http_status(:ok)
      end

      it "renders a json with self user's profiles" do
        get '/v2/printer_cloud/me/profiles', headers: authorization_headers

        expect(JSON.parse(response.body)).to include(
          'profiles' => %w[Administrador Gerente]
        )
      end
    end

    describe 'PUT /v2/printer_cloud/me/update' do
      let(:user) { create(:user) }
      let(:params) do
        {
          cpf: Faker::CPF.cpf,
          phone: Faker::PhoneNumber.cell_phone
        }
      end

      it 'responds with status ok' do
        put '/v2/printer_cloud/me/update', headers: authorization_headers, params: params

        expect(response).to have_http_status(:ok)
      end

      it 'renders self user updated' do
        put '/v2/printer_cloud/me/update', headers: authorization_headers, params: params

        user.reload

        expect(JSON.parse(response.body)).to include(
          'id' => user.id,
          'email' => user.email,
          'created_at' => user.created_at.iso8601(3),
          'updated_at' => user.updated_at.iso8601(3),
          'name' => user.name,
          'phone' => user.phone,
          'cpf' => user.cpf,
          'date_of_birth' => '2021-01-15',
          'status' => 'active',
          'avatar_url' => user.avatar_url
        )
      end
    end
  end
end
