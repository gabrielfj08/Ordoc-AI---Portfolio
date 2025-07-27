require 'rails_helper'

RSpec.describe 'Flow::Dashboard', type: :request do
  let(:organization) { create(:organization) }
  let(:user) { create(:user) }
  let(:valid_headers) {
    { 'Authorization' => "Bearer #{user.token}" }
  }

  describe 'when the user is an organization manager' do
    let!(:organization_manager_role) { create(:role, :organization_manager, user: user, organization: organization) }

    describe 'GET /flow/organization_manager/dashboards' do
      it 'returns the number of archived procedures' do
        get '/flow/organization_manager/dashboards', headers: valid_headers

        expect(JSON.parse(response.body)).to include(
          'slug' => 'archived_procedures_count',
          'data' => 0
        )
      end

      it 'returns the number of started procedures' do
        get '/flow/organization_manager/dashboards', headers: valid_headers

        expect(JSON.parse(response.body)).to include(
          'slug' => 'started_procedures_count',
          'data' => 0
        )
      end

      it 'returns the number of finished procedures' do
        get '/flow/organization_manager/dashboards', headers: valid_headers

        expect(JSON.parse(response.body)).to include(
          'slug' => 'finished_procedures_count',
          'data' => 0
        )
      end

      it 'returns the number of assigned tasks' do
        get '/flow/organization_manager/dashboards', headers: valid_headers

        expect(JSON.parse(response.body)).to include(
          'slug' => 'assigned_tasks_count',
          'data' => 0
        )
      end

      it 'returns the number of started tasks' do
        get '/flow/organization_manager/dashboards', headers: valid_headers

        expect(JSON.parse(response.body)).to include(
          'slug' => 'started_tasks_count',
          'data' => 0
        )
      end

      it 'returns the number of review tasks' do
        get '/flow/organization_manager/dashboards', headers: valid_headers

        expect(JSON.parse(response.body)).to include(
          'slug' => 'review_tasks_count',
          'data' => 0
        )
      end

      it 'returns the number of finished tasks' do
        get '/flow/organization_manager/dashboards', headers: valid_headers

        expect(JSON.parse(response.body)).to include(
          'slug' => 'finished_tasks_count',
          'data' => 0
        )
      end
    end
  end
end
