require 'rails_helper'

RSpec.describe 'PrinterCloud::Theme', type: :request do
  let!(:theme) { create(:theme, organization: user.organization) }
  let(:user) { create(:printer_cloud_user, :admin, :with_policies) }

  let(:credentials) do
    { 'Authorization' => "Bearer #{user.token}",
      'X-Api-Subdomain' => user.organization.subdomain }
  end

  describe 'GET /v3/printer_cloud/theme' do
    it 'returns a theme' do
      get '/v3/printer_cloud/theme', headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'returns a theme' do
      get '/v3/printer_cloud/theme', headers: credentials

      expect(JSON.parse(response.body)).to include(
        {
          'id' => theme.id,
          'image_url' => theme.image_url,
          'background_url' => theme.background_url,
          'color' => theme.color,
          'organization_id' => theme.organization_id,
          'created_at' => theme.created_at.iso8601(3),
          'updated_at' => theme.updated_at.iso8601(3)
        }
      )
    end
  end

  describe 'POST /v3/printer_cloud/theme' do
    before do
      theme.destroy!
    end

    let(:create_params) do
      {
        theme: {
          image_url: theme.image_url,
          background_url: theme.background_url,
          color: theme.color,
          organization_id: user.organization_id
        }
      }
    end

    it 'returns a created theme' do
      post '/v3/printer_cloud/theme', params: create_params, headers: credentials

      expect(response).to have_http_status(:created)
    end

    it 'returns a created theme' do
      post '/v3/printer_cloud/theme', params: create_params, headers: credentials

      theme_id = JSON.parse(response.body)['id']
      theme = ::PrinterCloud::Theme.find(theme_id)

      expect(JSON.parse(response.body)).to include(
        {
          'id' => theme.id,
          'image_url' => theme.image_url,
          'background_url' => theme.background_url,
          'color' => theme.color,
          'organization_id' => theme.organization_id,
          'created_at' => theme.created_at.iso8601(3),
          'updated_at' => theme.updated_at.iso8601(3)
        }
      )
    end
  end

  describe 'PUT /v3/printer_cloud/theme' do
    let(:update_params) do
      {
        theme: {
          image_url: theme.image_url,
          background_url: theme.background_url,
          color: theme.color
        }
      }
    end
    it 'returns the updated theme' do
      put '/v3/printer_cloud/theme', params: update_params, headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'returns the updated theme' do
      put '/v3/printer_cloud/theme', params: update_params, headers: credentials

      theme.reload

      expect(JSON.parse(response.body)).to include(
        {
          'id' => theme.id,
          'image_url' => theme.image_url,
          'background_url' => theme.background_url,
          'color' => theme.color,
          'organization_id' => theme.organization_id,
          'created_at' => theme.created_at.iso8601(3),
          'updated_at' => theme.updated_at.iso8601(3)
        }
      )
    end
  end

  describe 'DELETE /v3/printer_cloud/theme' do
    it 'returns a deleted theme' do
      delete '/v3/printer_cloud/theme', headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'returns a deleted theme' do
      delete '/v3/printer_cloud/theme', headers: credentials

      expect(JSON.parse(response.body)).to include(
        {
          'id' => theme.id,
          'image_url' => theme.image_url,
          'background_url' => theme.background_url,
          'color' => theme.color,
          'organization_id' => theme.organization_id,
          'created_at' => theme.created_at.iso8601(3),
          'updated_at' => theme.updated_at.iso8601(3)
        }
      )
    end
  end
end
