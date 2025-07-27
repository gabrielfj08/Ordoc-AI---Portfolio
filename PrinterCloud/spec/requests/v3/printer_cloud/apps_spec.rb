require 'rails_helper'

RSpec.describe 'PrinterCloud::App', type: :request do
  let(:user) { create(:printer_cloud_user, :admin) }
  let!(:air) { create(:app) }

  let(:credentials) do
    { 'Authorization' => "Bearer #{user.token}",
      'X-Api-Subdomain' => user.organization.subdomain }
  end

  describe 'GET /v3/printer_cloud/apps' do
    it 'returns the apps' do
      get '/v3/printer_cloud/apps', headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'returns the apps' do
      get '/v3/printer_cloud/apps', headers: credentials

      expect(JSON.parse(response.body)).to include(
        {
          'id' => air.id,
          'name' => air.name,
          'description' => 'App description.',
          'created_at' => air.created_at.iso8601(3),
          'prn' => air.prn,
          'service' => air.service,
          'updated_at' => air.updated_at.iso8601(3),
          'logo_url' => nil
        }
      )
    end
  end

  describe 'POST /v3/printer_cloud/apps' do
    let(:params) do
      {
        app: {
          name: 'Air x',
          description: 'Air x test',
          service: 'printer_air',
          logo: nil
        }
      }
    end
    it 'returns the apps' do
      post '/v3/printer_cloud/apps', params: params, headers: credentials

      expect(response).to have_http_status(:created)
    end

    it 'returns the apps' do
      post '/v3/printer_cloud/apps', params: params, headers: credentials

      app_id = JSON.parse(response.body)['id']
      app = App.find(app_id)

      expect(JSON.parse(response.body)).to include(
        {
          'id' => app.id,
          'name' => app.name,
          'description' => app.description,
          'created_at' => app.created_at.iso8601(3),
          'prn' => app.prn,
          'service' => app.service,
          'updated_at' => app.updated_at.iso8601(3),
          'logo_url' => nil
        }
      )
    end
  end
end
