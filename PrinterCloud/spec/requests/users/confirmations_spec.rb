require 'rails_helper'

RSpec.describe 'Users', type: :request do
  let(:user) { create(:user, confirmed_at: nil, status: 'pending') }

  describe 'GET /users/confirmation' do
    it 'returns the user' do
      get "/users/confirmation?confirmation_token=#{user.confirmation_token}"

      expect(response).to have_http_status(:ok)
    end
  end
end
