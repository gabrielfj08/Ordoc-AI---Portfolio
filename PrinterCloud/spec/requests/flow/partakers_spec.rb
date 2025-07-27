require 'rails_helper'

RSpec.describe 'Flow::Partaker', type: :request do
  let!(:partaker) { create(:partaker, organization: organization) }
  let(:organization) { create(:organization) }
  let(:user) { create(:user) }
  let(:valid_headers) {
    { 'Authorization' => "Bearer #{user.token}" }
  }

  let(:valid_attributes) {
    {
      address: 'Rua Lamenha Lins, 1900',
      cpf_cnpj: '36816077024',
      email: 'toby.maguire@example.com',
      name: 'Toby Maguire',
      notes: 'Diretor de Tecnologia',
      organization_id: organization.id,
      phone: '41984036779'
    }
  }

  let(:invalid_attributes) {
    {
      cpf_cnpj: nil,
      email: nil,
      name: nil,
      notes: nil,
      organization_id: organization.id
    }
  }

  describe 'when user is an organization manager' do
    let!(:organization_manager_role) { create(:role, :organization_manager, user: user, organization: organization) }

    describe 'GET /flow/organization_manager/partakers' do
      it 'returns the partakers' do
        get '/flow/organization_manager/partakers', headers: valid_headers

        expect(JSON.parse(response.body)).to include(
          'id'              => partaker.id,
          'address'         => partaker.address,
          'cpf_cnpj'        => partaker.cpf_cnpj,
          'email'           => partaker.email,
          'name'            => partaker.name,
          'notes'           => partaker.notes,
          'organization_id' => partaker.organization_id,
          'phone'           => partaker.phone,
          'status'          => partaker.status,
          'created_at'      => partaker.created_at.iso8601(3),
          'updated_at'      => partaker.updated_at.iso8601(3)
        )
      end
    end

    describe 'GET /flow/organization_manager/partakers/:id' do
      it 'renders the partaker' do
        get "/flow/organization_manager/partakers/#{partaker.id}", headers: valid_headers

        expect(JSON.parse(response.body)).to include(
          'id'              => partaker.id,
          'address'         => partaker.address,
          'cpf_cnpj'        => partaker.cpf_cnpj,
          'email'           => partaker.email,
          'name'            => partaker.name,
          'notes'           => partaker.notes,
          'organization_id' => partaker.organization_id,
          'phone'           => partaker.phone,
          'status'          => partaker.status,
          'created_at'      => partaker.created_at.iso8601(3),
          'updated_at'      => partaker.updated_at.iso8601(3)
        )
      end
    end

    describe 'POST /flow/organization_manager/partakers' do
      context 'with valid parameters' do
        it 'creates a new partaker' do
          expect do
            post '/flow/organization_manager/partakers',
                 params: { partaker: valid_attributes }, headers: valid_headers
          end.to change(Flow::Partaker, :count).by(1)
        end

        it 'renders a JSON response with the new partaker' do
          post '/flow/organization_manager/partakers',
                params: { partaker: valid_attributes }, headers: valid_headers

          expect(response).to have_http_status(:created)

          partaker_id = JSON.parse(response.body)['id']
          partaker = Flow::Partaker.find(partaker_id)

          expect(JSON.parse(response.body)).to include(
            'id'              => partaker.id,
            'address'         => partaker.address,
            'cpf_cnpj'        => partaker.cpf_cnpj,
            'email'           => partaker.email,
            'name'            => partaker.name,
            'notes'           => partaker.notes,
            'organization_id' => partaker.organization_id,
            'phone'           => partaker.phone,
            'status'          => partaker.status,
            'created_at'      => partaker.created_at.iso8601(3),
            'updated_at'      => partaker.updated_at.iso8601(3)
          )
        end
      end

      context 'with invalid parameters' do
        it 'does not create a new partaker' do
          expect do
            post '/flow/organization_manager/partakers',
                 params: { partaker: invalid_attributes }
          end.to change(Flow::Partaker, :count).by(0)
        end

        it "renders a JSON response with errors for the new partaker" do
          post '/flow/organization_manager/partakers',
              params: { partaker: invalid_attributes }, headers: valid_headers

          expect(response).to have_http_status(:unprocessable_entity)
          expect(response.content_type).to match(a_string_including('application/json'))
        end
      end
    end

    describe 'PATCH /flow/organization_manager/partakers/:id' do
      context 'with valid parameters' do
        let(:new_attributes) {
          {
            cpf_cnpj: '97185420008',
            name: 'Andrew Garfield',
            email: 'andrew.garfield@example.com',
            notes: 'Novo filme'
          }
        }

        it 'updates the requested partaker' do
          patch "/flow/organization_manager/partakers/#{partaker.id}",
                params: { partaker: new_attributes }, headers: valid_headers

          expect do
            partaker.reload
          end.to change { partaker.updated_at }
        end

        it 'renders a JSON response with the partaker' do
          patch "/flow/organization_manager/partakers/#{partaker.id}",
                params: { partaker: new_attributes }, headers: valid_headers

          partaker.reload

          expect(response).to have_http_status(:ok)
          expect(JSON.parse(response.body)).to include(
            'id'              => partaker.id,
            'address'         => partaker.address,
            'cpf_cnpj'        => partaker.cpf_cnpj,
            'email'           => partaker.email,
            'name'            => partaker.name,
            'notes'           => partaker.notes,
            'organization_id' => partaker.organization_id,
            'phone'           => partaker.phone,
            'status'          => partaker.status,
            'created_at'      => partaker.created_at.iso8601(3),
            'updated_at'      => partaker.updated_at.iso8601(3)
          )
        end
      end

      context "with invalid parameters" do
        it 'renders a JSON response with errors for the partaker' do
          patch "/flow/organization_manager/partakers/#{partaker.id}",
                params: { partaker: invalid_attributes }, headers: valid_headers

          expect(response).to have_http_status(:unprocessable_entity)
          expect(response.content_type).to match(a_string_including('application/json'))
        end
      end
    end

    describe 'DELETE /flow/organization_manager/partakers/:id' do
      it 'destroys the requested partaker' do
        expect do
          delete "/flow/organization_manager/partakers/#{partaker.id}", headers: valid_headers
        end.to change(Flow::Partaker, :count).by(-1)
      end
    end

    describe 'PATCH /flow/organization_manager/partakers/:id/activate' do
      context 'when partaker is inactive' do
        let(:partaker) { create(:partaker, organization: organization, status: :inactive) }

        it 'renders a JSON response with the active partaker' do
          patch "/flow/organization_manager/partakers/#{partaker.id}/activate", headers: valid_headers

          partaker.reload

          expect(JSON.parse(response.body)).to include(
            'id'              => partaker.id,
            'address'         => partaker.address,
            'cpf_cnpj'        => partaker.cpf_cnpj,
            'email'           => partaker.email,
            'name'            => partaker.name,
            'notes'           => partaker.notes,
            'organization_id' => partaker.organization_id,
            'phone'           => partaker.phone,
            'status'          => 'active',
            'created_at'      => partaker.created_at.iso8601(3),
            'updated_at'      => partaker.updated_at.iso8601(3)
          )
        end
      end
    end

    describe 'PATCH /flow/organization_manager/partakers/:id/deactivate' do
      context 'when partaker is active' do
        let(:partaker) { create(:partaker, organization: organization, status: :active) }

        it 'renders a JSON response with the inactive partaker' do
          patch "/flow/organization_manager/partakers/#{partaker.id}/deactivate", headers: valid_headers

          partaker.reload

          expect(JSON.parse(response.body)).to include(
            'id'              => partaker.id,
            'address'         => partaker.address,
            'cpf_cnpj'        => partaker.cpf_cnpj,
            'email'           => partaker.email,
            'name'            => partaker.name,
            'notes'           => partaker.notes,
            'organization_id' => partaker.organization_id,
            'phone'           => partaker.phone,
            'status'          => 'inactive',
            'created_at'      => partaker.created_at.iso8601(3),
            'updated_at'      => partaker.updated_at.iso8601(3)
          )
        end
      end
    end
  end
end
