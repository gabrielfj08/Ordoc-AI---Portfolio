require 'rails_helper'

RSpec.describe "/healthchecks", type: :request do
  describe "GET /healthcheck" do
    it "renders a JSON response with healthcheck data" do
      get "/healthcheck"

      expect(response).to have_http_status(:ok)

      expect(JSON.parse(response.body)).to include(
        'status' => 'available',
      )
    end
  end
end
