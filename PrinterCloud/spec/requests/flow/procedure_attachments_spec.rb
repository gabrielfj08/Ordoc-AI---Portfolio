require 'rails_helper'

RSpec.describe 'Flow::ProcedureAttachment', type: :request do
  let!(:procedure_attachment) { create(:procedure_attachment, procedure: procedure) }
  let(:procedure) { create(:procedure, department: department, created_by_id: user.id) }
  let(:department) { create(:department, organization: organization) }
  let(:organization) { create(:organization) }
  let(:user) { create(:user) }
  let(:file) { fixture_file_upload('file.png') }
  let(:valid_headers) {
    { 'Authorization' => "Bearer #{user.token}" }
  }

  let(:valid_attributes) {
    {
      file: file
    }
  }

  let(:invalid_attributes) {
    {
      file: nil
    }
  }

  describe 'when user is an organization manager' do
    let!(:organization_manager_role) { create(:role, :organization_manager, user: user, organization: organization) }

    describe 'GET /flow/organization_manager/procedures/:procedure_id/procedure_attachments' do
      it 'returns the procedure procedure attachments' do
        get "/flow/organization_manager/procedures/#{procedure.id}/procedure_attachments", headers: valid_headers

        expect(JSON.parse(response.body)).to include(
          'id'         => procedure_attachment.id,
          'name'       => 'file.png',
          'signed'     => procedure_attachment.procedure_attachment_signatures.present?,
          'url'        => procedure_attachment.url,
          'created_at' => procedure_attachment.created_at.iso8601(3),
          'updated_at' => procedure_attachment.updated_at.iso8601(3)
        )
      end
    end

    describe 'GET /flow/organization_manager/procedures/:procedure_id/procedure_attachments/:id' do
      it 'renders the procedure attachment' do
        get "/flow/organization_manager/procedures/#{procedure.id}/procedure_attachments/#{procedure_attachment.id}", headers: valid_headers

        expect(JSON.parse(response.body)).to include(
          'id'         => procedure_attachment.id,
          'name'       => 'file.png',
          'url'        => procedure_attachment.url,
          'created_at' => procedure_attachment.created_at.iso8601(3),
          'updated_at' => procedure_attachment.updated_at.iso8601(3)
        )
      end
    end

    describe 'POST /flow/organization_manager/procedures/:procedure_id/procedure_attachments' do
      context 'with valid parameters' do
        it 'creates a new procedure attachment' do
          expect do
            post "/flow/organization_manager/procedures/#{procedure.id}/procedure_attachments",
                 params: { procedure_attachment: valid_attributes }, headers: valid_headers
          end.to change(Flow::ProcedureAttachment, :count).by(1)
        end

        it 'renders a JSON response with the new procedure attachment' do
          post "/flow/organization_manager/procedures/#{procedure.id}/procedure_attachments",
              params: { procedure_attachment: valid_attributes }, headers: valid_headers

          expect(response).to have_http_status(:created)

          procedure_attachment_id = JSON.parse(response.body)['id']
          procedure_attachment = Flow::ProcedureAttachment.find(procedure_attachment_id)

          expect(JSON.parse(response.body)).to include(
            'id'         => procedure_attachment.id,
            'name'       => 'file.png',
            'url'        => procedure_attachment.url,
            'created_at' => procedure_attachment.created_at.iso8601(3),
            'updated_at' => procedure_attachment.updated_at.iso8601(3)
          )
          expect(response.content_type).to match(a_string_including('application/json'))
        end
      end

      context 'with invalid parameters' do
        it 'does not create a new procedure attachment' do
          expect do
            post "/flow/organization_manager/procedures/#{procedure.id}/procedure_attachments",
                 params: { procedure_attachment: invalid_attributes }
          end.to change(Flow::ProcedureAttachment, :count).by(0)
        end

        it 'renders a JSON response with errors for the new procedure attachment' do
          post "/flow/organization_manager/procedures/#{procedure.id}/procedure_attachments",
              params: { procedure_attachment: invalid_attributes }, headers: valid_headers

          expect(response).to have_http_status(:bad_request)
          expect(response.content_type).to match(a_string_including('application/json'))
        end
      end
    end

    # describe 'PATCH /update' do
    #   context 'with valid parameters' do
    #     let(:new_attributes) {
    #       {
    #         name: 'new_name.png'
    #       }
    #     }

    #     it 'updates the requested procedure attachment' do
    #       patch "/flow/organization_manager/procedures/#{procedure.id}/procedure_attachments/#{procedure_attachment.id}",
    #             params: { procedure_attachment: new_attributes }, headers: valid_headers

    #       expect do
    #         procedure_attachment.reload
    #       end.to change { procedure_attachment.updated_at }
    #     end

    #     it 'renders a JSON response with the procedure attachment' do
    #       patch "/flow/organization_manager/procedures/#{procedure.id}/procedure_attachments/#{procedure_attachment.id}",
    #             params: { procedure_attachment: new_attributes }, headers: valid_headers

    #       expect(response).to have_http_status(:ok)
    #       expect(JSON.parse(response.body)).to include(
    #         'id'         => procedure_attachment.id,
    #         'name'       => 'file.png',
    #         'url'        => Rails.application.routes.url_helpers.rails_blob_path(procedure_attachment.file.attachment, only_path: true),
    #         'created_at' => procedure_attachment.created_at.iso8601(3),
    #         'updated_at' => procedure_attachment.updated_at.iso8601(3)
    #       )
    #     end
    #   end

    #   context 'with invalid parameters' do
    #     it 'renders a JSON response with errors for the procedure attachment' do
    #       patch "/flow/organization_manager/procedures/#{procedure.id}/procedure_attachments/#{procedure_attachment.id}",
    #             params: { procedure_attachment: invalid_attributes }, headers: valid_headers
    #       expect(response).to have_http_status(:bad_request)
    #       expect(response.content_type).to match(a_string_including('application/json'))
    #     end
    #   end
    # end

    describe 'DELETE /destroy' do
      it 'destroys the requested procedure attachment' do
        expect do
          delete "/flow/organization_manager/procedures/#{procedure.id}/procedure_attachments/#{procedure_attachment.id}", headers: valid_headers
        end.to change(Flow::ProcedureAttachment.kept, :count).by(-1)
      end
    end
  end
end
