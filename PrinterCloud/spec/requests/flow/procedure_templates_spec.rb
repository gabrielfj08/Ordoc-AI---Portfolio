require 'rails_helper'

RSpec.describe '/procedure_templates', type: :request do
  let!(:procedure_template) { create(:procedure_template, organization: organization) }
  let(:organization) { create(:organization) }
  let(:user) { create(:user) }
  let(:valid_headers) do
    { 'Authorization' => "Bearer #{user.token}" }
  end

  let(:valid_attributes) {
    {
      name: 'Tipo de processo',
      description: 'Descrição',
      organization_id: organization.id
    }
  }

  let(:invalid_attributes) {
    {
      name: nil,
      description: nil,
      organization_id: organization.id
    }
  }

  describe 'when user is an organization manager' do
    let!(:organization_manager_role) { create(:role, :organization_manager, user: user, organization: organization) }

    describe 'GET /flow/organization_manager/procedure_templates' do
      it 'returns the procedure templates' do
        get '/flow/organization_manager/procedure_templates', headers: valid_headers
        expect(JSON.parse(response.body)).to include(
          'id'                => procedure_template.id,
          'organization_id'   => procedure_template.organization_id,
          'description'       => procedure_template.description,
          'name'              => procedure_template.name,
          'status'            => 'active',
          'created_at'        => procedure_template.created_at.iso8601(3),
          'attachments_count' => procedure_template.attachments.count,
          'updated_at'        => procedure_template.updated_at.iso8601(3)
        )
      end
    end

    describe 'GET /flow/organization_manager/procedure_templates/:id' do
      it 'returns the procedure template' do
        get "/flow/organization_manager/procedure_templates/#{procedure_template.id}", headers: valid_headers

        expect(JSON.parse(response.body)).to include(
          'id'              => procedure_template.id,
          'organization_id' => procedure_template.organization_id,
          'description'     => procedure_template.description,
          'name'            => procedure_template.name,
          'status'          => 'active',
          'created_at'      => procedure_template.created_at.iso8601(3),
          'updated_at'      => procedure_template.updated_at.iso8601(3)
        )
      end
    end

    describe 'POST /flow/organization_manager/procedure_templates' do
      context 'with valid parameters' do
        it 'creates a new procedure template' do
          expect do
            post '/flow/organization_manager/procedure_templates', params: { procedure_template: valid_attributes }, headers: valid_headers
          end.to change(Flow::ProcedureTemplate, :count).by(1)
        end

        it 'renders a JSON repsonse with the procedure template' do
          post '/flow/organization_manager/procedure_templates', params: { procedure_template: valid_attributes }, headers: valid_headers

          expect(response).to have_http_status(:created)

          procedure_template_id = JSON.parse(response.body)['id']
          procedure_template = Flow::ProcedureTemplate.find(procedure_template_id)

          expect(JSON.parse(response.body)).to include(
            'id'              => procedure_template.id,
            'organization_id' => procedure_template.organization_id,
            'description'     => procedure_template.description,
            'name'            => procedure_template.name,
            'status'          => 'active',
            'created_at'      => procedure_template.created_at.iso8601(3),
            'updated_at'      => procedure_template.updated_at.iso8601(3)
          )
        end
      end

      context 'with invalid parameters' do
        it 'does not create a new procedure template' do
          expect do
            post '/flow/organization_manager/procedure_templates', params: { procedure_template: invalid_attributes }, headers: valid_headers
          end.to change(Flow::ProcedureTemplate, :count).by(0)
        end

        it 'renders a JSON response with errors for the procedure template' do
          post '/flow/organization_manager/procedure_templates', params: { procedure_template: invalid_attributes }, headers: valid_headers

          expect(response).to have_http_status(:unprocessable_entity)
          expect(response.content_type).to match(a_string_including('application/json'))
        end
      end
    end

    describe 'PATCH /flow/organization_manager/procedure_templates/:id' do
      context 'with valid parameters' do
        let(:new_attributes) {
          {
            name: 'Nome Atualizado',
            description: 'Descrição Atualizada'
          }
        }

        it 'updates the requested procedure template' do
          patch "/flow/organization_manager/procedure_templates/#{procedure_template.id}",
                params: { procedure_template: new_attributes }, headers: valid_headers

          procedure_template.reload

          expect(response).to have_http_status(:ok)
          expect(JSON.parse(response.body)).to include(
            'id'              => procedure_template.id,
            'organization_id' => procedure_template.organization_id,
            'description'     => procedure_template.description,
            'name'            => procedure_template.name,
            'status'          => 'active',
            'created_at'      => procedure_template.created_at.iso8601(3),
            'updated_at'      => procedure_template.updated_at.iso8601(3)
          )
        end
      end

      context 'with invalid parameters' do
        it 'renders a JSON response with errors for the procedure template' do
          patch "/flow/organization_manager/procedure_templates/#{procedure_template.id}",
                params: { procedure_template: invalid_attributes }, headers: valid_headers

          expect(response).to have_http_status(:unprocessable_entity)
          expect(response.content_type).to match(a_string_including('application/json'))
        end
      end
    end

    describe 'DELETE /flow/organization_manager/procedure_templates/:id' do
      it 'destroys the requested procedure template' do
        expect do
          delete "/flow/organization_manager/procedure_templates/#{procedure_template.id}", headers: valid_headers
        end.to change(Flow::ProcedureTemplate.kept, :count).by(-1)
      end
    end
  end
end
