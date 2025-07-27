require 'rails_helper'

RSpec.describe '/procedures', type: :request do
  let!(:procedure) { create(:procedure, department: department, created_by_id: user.id) }
  let(:department) { create(:department, organization: organization) }
  let(:organization) { create(:organization) }
  let(:procedure_template) { create(:procedure_template, organization: organization) }
  let(:user) { create(:user) }
  let(:valid_headers) do
    { 'Authorization' => "Bearer #{user.token}" }
  end

  let(:valid_attributes) {
    {
      name: 'Abrir empresa',
      description: 'Esse é o procedimento para abrir uma empresa',
      public: false,
      department_id: department.id,
      procedure_template_id: procedure_template.id
    }
  }

  let(:invalid_attributes) {
    {
      name: nil,
      description: nil,
      department_id: department.id,
      procedure_template_id: procedure_template.id
    }
  }

  describe 'when user is an organization manager' do
    let!(:organization_manager_role) { create(:role, :organization_manager, user: user, organization: organization) }

    describe 'GET /flow/organization_manager/procedures' do
      it 'returns the procedures' do
        get '/flow/organization_manager/procedures', headers: valid_headers

        expect(JSON.parse(response.body)).to include(
          'id'                      => procedure.id,
          'department_id'           => procedure.department_id,
          'description'             => procedure.description,
          'document_number'         => procedure.document_number,
          'internal_process_number' => procedure.internal_process_number,
          'name'                    => procedure.name,
          'parent_id'               => procedure.parent_id,
          'procedure_template_id'   => procedure.procedure_template_id,
          'procedure_template'      => {
            'name' => procedure.procedure_template.name
          },
          'public'                  => procedure.public,
          'status'                  => procedure.status,
          'created_by_id'           => procedure.created_by_id,
          'created_at'              => procedure.created_at.iso8601(3),
          'updated_at'              => procedure.updated_at.iso8601(3),
          'archived_at'             => nil,
          'department_name'         => procedure.department.name
        )
      end
    end

    describe 'GET /flow/organization_manager/procedures/:id' do
      it 'returns the user group' do
        get "/flow/organization_manager/procedures/#{procedure.id}", headers: valid_headers

        expect(JSON.parse(response.body)).to include(
          'id'                      => procedure.id,
          'department_id'           => procedure.department_id,
          'description'             => procedure.description,
          'document_number'         => procedure.document_number,
          'internal_process_number' => procedure.internal_process_number,
          'name'                    => procedure.name,
          'parent_id'               => procedure.parent_id,
          'public'                  => procedure.public,
          'status'                  => procedure.status,
          'created_by_id'           => procedure.created_by_id,
          'created_at'              => procedure.created_at.iso8601(3),
          'updated_at'              => procedure.updated_at.iso8601(3)
        )
      end
    end

    describe 'POST /flow/organization_manager/procedures' do
      context 'with valid parameters' do
        it 'creates a new procedure' do
          expect do
            post '/flow/organization_manager/procedures',
                 params: { procedure: valid_attributes }, headers: valid_headers
          end.to change(Flow::Procedure, :count).by(1)
        end

        it 'renders a JSON response with the new procedure' do
          post '/flow/organization_manager/procedures',
               params: { procedure: valid_attributes }, headers: valid_headers

          expect(response).to have_http_status(:created)

          procedure_id = JSON.parse(response.body)['id']
          procedure = Flow::Procedure.find(procedure_id)

          expect(JSON.parse(response.body)).to include(
            'id'                      => procedure.id,
            'department_id'           => procedure.department_id,
            'description'             => procedure.description,
            'document_number'         => procedure.document_number,
            'internal_process_number' => procedure.internal_process_number,
            'name'                    => procedure.name,
            'parent_id'               => procedure.parent_id,
            'public'                  => procedure.public,
            'status'                  => procedure.status,
            'created_by_id'           => procedure.created_by_id,
            'created_at'              => procedure.created_at.iso8601(3),
            'updated_at'              => procedure.updated_at.iso8601(3)
          )
        end
      end

      context 'with invalid parameters' do
        it 'does not create a new procedure' do
          expect do
            post '/flow/organization_manager/procedures',
                 params: { procedure: invalid_attributes }
          end.to change(Flow::Procedure, :count).by(0)
        end

        it 'renders a JSON response with errors for the new procedure' do
          post '/flow/organization_manager/procedures',
               params: { procedure: invalid_attributes }, headers: valid_headers

          expect(response).to have_http_status(:unprocessable_entity)
          expect(response.content_type).to match(a_string_including('application/json'))
        end
      end
    end

    describe 'PATCH /flow/organization_manager/procedures/:id' do
      context 'with valid parameters' do
        let(:new_attributes) {
          {
            name: 'Processo Atualizado',
            description: 'Descrição atualizada'
          }
        }

        it 'updates the requested procedure' do
          patch "/flow/organization_manager/procedures/#{procedure.id}",
                params: { procedure: new_attributes }, headers: valid_headers

          expect do
            procedure.reload
          end.to change { procedure.updated_at }
        end

        it 'renders a JSON response with the procedure' do
          patch "/flow/organization_manager/procedures/#{procedure.id}",
                params: { procedure: new_attributes }, headers: valid_headers

          procedure.reload

          expect(response).to have_http_status(:ok)
          expect(JSON.parse(response.body)).to include(
            'id'                      => procedure.id,
            'department_id'           => procedure.department_id,
            'description'             => procedure.description,
            'document_number'         => procedure.document_number,
            'internal_process_number' => procedure.internal_process_number,
            'name'                    => procedure.name,
            'parent_id'               => procedure.parent_id,
            'public'                  => procedure.public,
            'status'                  => procedure.status,
            'created_by_id'           => procedure.created_by_id,
            'created_at'              => procedure.created_at.iso8601(3),
            'updated_at'              => procedure.updated_at.iso8601(3)
          )
        end
      end

      context 'with invalid parameters' do
        it 'renders a JSON response with errors for the procedure' do
          patch "/flow/organization_manager/procedures/#{procedure.id}",
                params: { procedure: invalid_attributes }, headers: valid_headers

          expect(response).to have_http_status(:unprocessable_entity)
          expect(response.content_type).to match(a_string_including('application/json'))
        end
      end
    end
  end
end
