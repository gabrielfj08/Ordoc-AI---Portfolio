require 'rails_helper'

RSpec.describe 'Flow::UserGroup', type: :request do
  let!(:user_group) { create(:user_group, organization: organization) }
  let(:organization) { create(:organization) }
  let(:user) { create(:user) }
  let(:valid_headers) {
    { 'Authorization' => "Bearer #{user.token}" }
  }

  let(:valid_attributes) {
    {
      name: 'Grupo',
      notes: 'Observações',
      organization_id: organization.id
    }
  }

  let(:invalid_attributes) {
    {
      name: nil,
      notes: nil,
      organization_id: organization.id
    }
  }

  describe 'when the user is an organization manager' do
    let!(:organization_manager_role) { create(:role, :organization_manager, user: user, organization: organization) }

    describe 'GET /flow/organization_manager/user_groups' do
      it 'returns the user groups' do
        get '/flow/organization_manager/user_groups', headers: valid_headers

        expect(JSON.parse(response.body)).to include(
          'id'              => user_group.id,
          'name'            => user_group.name,
          'notes'           => user_group.notes,
          'organization_id' => organization.id,
          'status'          => 'active',
          'created_at'      => user_group.created_at.iso8601(3),
          'updated_at'      => user_group.updated_at.iso8601(3),
          'users_count'     => 0
        )
      end
    end

    describe 'GET /flow/organization_manager/user_groups/:id' do
      it 'returns the user group' do
        get "/flow/organization_manager/user_groups/#{user_group.id}", headers: valid_headers

        expect(JSON.parse(response.body)).to include(
          'id'              => user_group.id,
          'name'            => user_group.name,
          'notes'           => user_group.notes,
          'organization_id' => organization.id,
          'status'          => 'active',
          'created_at'      => user_group.created_at.iso8601(3),
          'updated_at'      => user_group.updated_at.iso8601(3)
        )
      end
    end

    describe 'POST /flow/organization_manager/user_groups' do
      context 'with valid parameters' do
        it 'creates a new user group' do
          expect do
            post '/flow/organization_manager/user_groups', params: { user_group: valid_attributes }, headers: valid_headers
          end.to change(Flow::UserGroup, :count).by(1)
        end

        it 'renders a JSON response with the user group' do
          post '/flow/organization_manager/user_groups', params: { user_group: valid_attributes }, headers: valid_headers

          expect(response).to have_http_status(:created)

          user_group_id = JSON.parse(response.body)['id']
          user_group = Flow::UserGroup.find(user_group_id)

          expect(JSON.parse(response.body)).to include(
            'id'              => user_group.id,
            'name'            => 'Grupo',
            'notes'           => 'Observações',
            'organization_id' => organization.id,
            'status'          => 'active',
            'created_at'      => user_group.created_at.iso8601(3),
            'updated_at'      => user_group.updated_at.iso8601(3)
          )
        end
      end

      context 'with invalid parameters' do
        it 'does not create a new user group' do
          expect do
            post '/flow/organization_manager/user_groups', params: { user_group: invalid_attributes }, headers: valid_headers
          end.to change(Flow::UserGroup, :count).by(0)
        end

        it 'renders a JSON response with errors for the new user group' do
          post '/flow/organization_manager/user_groups',
              params: { user_group: invalid_attributes }, headers: valid_headers

          expect(response).to have_http_status(:unprocessable_entity)
          expect(response.content_type).to match(a_string_including('application/json'))
        end
      end
    end

    describe 'PATCH /flow/organization_manager/user_groups/:id' do
      context 'with valid parameters' do
        let(:new_attributes) {
          {
            name: 'Grupo Atualizado',
            notes: 'Observações Atualizadas'
          }
        }

        it 'updates the requested user_group' do
          patch "/flow/organization_manager/user_groups/#{user_group.id}",
                params: { user_group: new_attributes }, headers: valid_headers

          expect do
            user_group.reload
          end.to change { user_group.updated_at }
        end

        it 'renders a JSON response with the user_group' do
          patch "/flow/organization_manager/user_groups/#{user_group.id}",
                params: { user_group: new_attributes }, headers: valid_headers

          user_group.reload

          expect(response).to have_http_status(:ok)
          expect(JSON.parse(response.body)).to include(
            'id'              => user_group.id,
            'name'            => 'Grupo Atualizado',
            'notes'           => 'Observações Atualizadas',
            'organization_id' => organization.id,
            'status'          => 'active',
            'created_at'      => user_group.created_at.iso8601(3),
            'updated_at'      => user_group.updated_at.iso8601(3)
          )
        end
      end

      context 'with invalid parameters' do
        it 'renders a JSON response with errors for the user group' do
          patch "/flow/organization_manager/user_groups/#{user_group.id}",
                params: { user_group: invalid_attributes }, headers: valid_headers

          expect(response).to have_http_status(:unprocessable_entity)
          expect(response.content_type).to match(a_string_including('application/json'))
        end
      end
    end

    describe 'DELETE /flow/organization_manager/user_groups/:id' do
      it 'destroys the requested user group' do
        expect do
          delete "/flow/organization_manager/user_groups/#{user_group.id}", headers: valid_headers
        end.to change(Flow::UserGroup.kept, :count).by(-1)
      end
    end
  end
end
