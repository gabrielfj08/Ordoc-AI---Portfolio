require 'rails_helper'

RSpec.describe 'PrinterCloud::Decree', type: :request do
  let(:user) { create(:printer_cloud_user, :with_policies, :admin) }
  let!(:decree) { create(:decree, organization: user.organization) }
  let(:credentials) do
    { 'Authorization' => "Bearer #{user.token}",
      'X-Api-Subdomain' => user.organization.subdomain }
  end

  describe 'GET /v3/printer_cloud/decree' do
    it 'returns a decree' do
      get '/v3/printer_cloud/decree', headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'returns a decree' do
      get '/v3/printer_cloud/decree', headers: credentials

      expect(JSON.parse(response.body)).to include(
        {
          'id' => decree.id,
          'decree_number' => decree.decree_number,
          'decree_date' => decree.decree_date.to_s,
          'decree_url' => decree.decree_url,
          'body' => decree.body,
          'law_number' => decree.law_number,
          'law_date' => decree.law_date.to_s,
          'law_url' => decree.law_url,
          'organization_id' => decree.organization_id,
          'created_at' => decree.created_at.iso8601(3),
          'updated_at' => decree.updated_at.iso8601(3)
        }
      )
    end
  end

  describe 'POST /v3/printer_cloud/decree' do
    before do
      decree.destroy!
    end

    let(:create_params) do
      {
        decree: {
          decree_number: decree.decree_number,
          decree_date: decree.decree_date,
          decree_url: decree.decree_url,
          body: decree.body,
          law_number: decree.law_number,
          law_date: decree.law_date,
          law_url: decree.law_url,
          organization_id: user.organization.id
        }
      }
    end

    it 'returns a created decree' do
      post '/v3/printer_cloud/decree', params: create_params, headers: credentials

      expect(response).to have_http_status(:created)
    end

    it 'returns a created decree' do
      post '/v3/printer_cloud/decree', params: create_params, headers: credentials

      decree_id = JSON.parse(response.body)['id']
      decree = ::PrinterCloud::Decree.find(decree_id)

      expect(JSON.parse(response.body)).to include(
        {
          'id' => decree.id,
          'decree_number' => decree.decree_number,
          'decree_date' => decree.decree_date.to_s,
          'decree_url' => decree.decree_url,
          'body' => decree.body,
          'law_number' => decree.law_number,
          'law_date' => decree.law_date.to_s,
          'law_url' => decree.law_url,
          'organization_id' => decree.organization_id,
          'created_at' => decree.created_at.iso8601(3),
          'updated_at' => decree.updated_at.iso8601(3)
        }
      )
    end
  end

  describe 'PUT /v3/printer_cloud/decree' do
    let(:update_params) do
      {
        decree: {
          decree_number: decree.decree_number,
          decree_date: decree.decree_date,
          decree_url: decree.decree_url,
          body: decree.body,
          law_number: decree.law_number,
          law_date: decree.law_date,
          law_url: decree.law_url
        }
      }
    end
    it 'returns the updated decree' do
      put '/v3/printer_cloud/decree', params: update_params, headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'returns the updated decree' do
      put '/v3/printer_cloud/decree', params: update_params, headers: credentials

      decree.reload

      expect(JSON.parse(response.body)).to include(
        {
          'id' => decree.id,
          'decree_number' => decree.decree_number,
          'decree_date' => decree.decree_date.to_s,
          'decree_url' => decree.decree_url,
          'body' => decree.body,
          'law_number' => decree.law_number,
          'law_date' => decree.law_date.to_s,
          'law_url' => decree.law_url,
          'organization_id' => decree.organization_id,
          'created_at' => decree.created_at.iso8601(3),
          'updated_at' => decree.updated_at.iso8601(3)
        }
      )
    end
  end

  describe 'DELETE /v3/printer_cloud/decree' do
    it 'returns a deleted decree' do
      delete '/v3/printer_cloud/decree', headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'returns a deleted decree' do
      delete '/v3/printer_cloud/decree', headers: credentials

      expect(JSON.parse(response.body)).to include(
        {
          'id' => decree.id,
          'decree_number' => decree.decree_number,
          'decree_date' => decree.decree_date.to_s,
          'decree_url' => decree.decree_url,
          'body' => decree.body,
          'law_number' => decree.law_number,
          'law_date' => decree.law_date.to_s,
          'law_url' => decree.law_url,
          'organization_id' => decree.organization_id,
          'created_at' => decree.created_at.iso8601(3),
          'updated_at' => decree.updated_at.iso8601(3)
        }
      )
    end
  end
end
