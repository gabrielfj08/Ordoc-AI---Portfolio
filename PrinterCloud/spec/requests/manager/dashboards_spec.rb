require 'rails_helper'

RSpec.describe 'Dashboards', type: :request do
  let!(:organization) { create(:organization) }
  let(:user) { create(:user) }
  let(:authorization_headers) do
    { 'Authorization' => "Bearer #{user.token}" }
  end

  describe 'GET manager/organizations/organization_id/dashboards' do
    context 'when user is not manager' do
      it 'returns unauthorized error' do
        get "/manager/organizations/#{organization.id}/dashboards", headers: authorization_headers
        expect(JSON.parse(response.body)).to include(
          'message' => 'Apenas gerentes podem realizar essa operação',
          'error' => 'forbidden',
          'status' => 403
        )
      end
    end

    context 'when user is manager' do
      let!(:role) { create(:role, :organization_manager, user: user, organization: organization) }

      it 'returns the users count' do
        get "/manager/organizations/#{organization.id}/dashboards", headers: authorization_headers
        expect(JSON.parse(response.body)).to include(
          'slug' => 'users_count',
          'data' => 1
        )
      end

      it 'returns the active users count' do
        user.update(current_sign_in_at: Time.now)

        get "/manager/organizations/#{organization.id}/dashboards", headers: authorization_headers

        expect(JSON.parse(response.body)).to include(
          'slug' => 'active_users_count',
          'data' => 1
        )
      end

      it 'returns the managers count' do
        get "/manager/organizations/#{organization.id}/dashboards", headers: authorization_headers

        expect(JSON.parse(response.body)).to include(
          'slug' => 'managers_count',
          'data' => 1
        )
      end

      it 'returns the used storage' do
        get "/manager/organizations/#{organization.id}/dashboards", headers: authorization_headers

        expect(JSON.parse(response.body)).to include(
          'slug' => 'used_storage',
          'data' => '0 Bytes'
        )
      end

      it 'returns the departments count' do
        department = create(:department, organization: organization)

        get "/manager/organizations/#{organization.id}/dashboards", headers: authorization_headers

        expect(JSON.parse(response.body)).to include(
          'slug' => 'departments_count',
          'data' => 1
        )
      end

      it 'returns the directories count' do
        directory = create(:directory, organization: organization)

        get "/manager/organizations/#{organization.id}/dashboards", headers: authorization_headers

        expect(JSON.parse(response.body)).to include(
          'slug' => 'directories_count',
          'data' => 1
        )
      end

      it 'returns the documents count' do
        directory = create(:directory, organization: organization)
        document = create(:document, directory: directory)

        get "/manager/organizations/#{organization.id}/dashboards", headers: authorization_headers

        expect(JSON.parse(response.body)).to include(
          { 'data' => 1, 'slug' => 'users_count' },
          { 'data' => 0, 'slug' => 'active_users_count' },
          { 'data' => 1, 'slug' => 'managers_count' },
          { 'data' => '0 Bytes', 'slug' => 'used_storage' },
          { 'data' => 1, 'slug' => 'departments_count' },
          { 'data' => 1, 'slug' => 'directories_count' },
          { 'data' => 0, 'slug' => 'documents_count' }
        )
      end
    end
  end
end
