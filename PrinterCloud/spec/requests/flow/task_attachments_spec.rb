require 'rails_helper'

RSpec.describe 'Flow::TaskAttachment', type: :request do
  let!(:task_attachments) { create(:task_attachments, task: task) }
  let(:task) { create(:task, procedure: procedure) }
  let(:procedure) { create(:procedure, department: department) }
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

    describe 'GET /flow/organization_manager/tasks/:task_id/task_attachments' do
      it 'returns the task task attachments' do
        get "/flow/organization_manager/tasks/#{task.id}/task_attachments", headers: valid_headers

        expect(JSON.parse(response.body)).to include(
          'id'         => task_attachments.id,
          'name'       => 'file.png',
          'signed'     => task_attachments.task_attachment_signatures.present?,
          'url'        => task_attachments.url,
          'created_at' => task_attachments.created_at.iso8601(3),
          'updated_at' => task_attachments.updated_at.iso8601(3)
        )
      end
    end

    describe 'GET /flow/organization_manager/tasks/:task_id/task_attachments/:id' do
      it 'renders the task attachment' do
        get "/flow/organization_manager/tasks/#{task.id}/task_attachments/#{task_attachments.id}", headers: valid_headers

        expect(JSON.parse(response.body)).to include(
          'id'         => task_attachments.id,
          'name'       => 'file.png',
          'url'        => task_attachments.url,
          'created_at' => task_attachments.created_at.iso8601(3),
          'updated_at' => task_attachments.updated_at.iso8601(3)
        )
      end
    end

    describe 'POST /flow/organization_manager/tasks/:task_id/task_attachments' do
      context 'with valid parameters' do
        it 'creates a new task attachment' do
          expect do
            post "/flow/organization_manager/tasks/#{task.id}/task_attachments",
                 params: { task_attachment: valid_attributes }, headers: valid_headers
          end.to change(Flow::TaskAttachment, :count).by(1)
        end

        it 'renders a JSON response with the new task attachment' do
          post "/flow/organization_manager/tasks/#{task.id}/task_attachments",
              params: { task_attachment: valid_attributes }, headers: valid_headers

          expect(response).to have_http_status(:created)

          task_attachments_id = JSON.parse(response.body)['id']
          task_attachments = Flow::TaskAttachment.find(task_attachments_id)

          expect(JSON.parse(response.body)).to include(
            'id'         => task_attachments.id,
            'name'       => 'file.png',
            'url'        => task_attachments.url,
            'created_at' => task_attachments.created_at.iso8601(3),
            'updated_at' => task_attachments.updated_at.iso8601(3)
          )
          expect(response.content_type).to match(a_string_including('application/json'))
        end
      end

      context 'with invalid parameters' do
        it 'does not create a new task attachment' do
          expect do
            post "/flow/organization_manager/tasks/#{task.id}/task_attachments",
                 params: { task_attachments: invalid_attributes }
          end.to change(Flow::TaskAttachment, :count).by(0)
        end

        it 'renders a JSON response with errors for the new task attachment' do
          post "/flow/organization_manager/tasks/#{task.id}/task_attachments",
              params: { task_attachments: invalid_attributes }, headers: valid_headers

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

    #     it 'updates the requested task attachment' do
    #       patch "/flow/organization_manager/tasks/#{task.id}/task_attachments/#{task_attachments.id}",
    #             params: { task_attachments: new_attributes }, headers: valid_headers

    #       expect do
    #         task_attachments.reload
    #       end.to change { task_attachments.updated_at }
    #     end

    #     it 'renders a JSON response with the task attachment' do
    #       patch "/flow/organization_manager/tasks/#{task.id}/task_attachments/#{task_attachments.id}",
    #             params: { task_attachments: new_attributes }, headers: valid_headers

    #       expect(response).to have_http_status(:ok)
    #       expect(JSON.parse(response.body)).to include(
    #         'id'         => task_attachments.id,
    #         'name'       => 'file.png',
    #         'url'        => Rails.application.routes.url_helpers.rails_blob_path(task_attachments.file.attachment, only_path: true),
    #         'created_at' => task_attachments.created_at.iso8601(3),
    #         'updated_at' => task_attachments.updated_at.iso8601(3)
    #       )
    #     end
    #   end

    #   context 'with invalid parameters' do
    #     it 'renders a JSON response with errors for the task attachment' do
    #       patch "/flow/organization_manager/tasks/#{task.id}/task_attachments/#{task_attachments.id}",
    #             params: { task_attachments: invalid_attributes }, headers: valid_headers
    #       expect(response).to have_http_status(:bad_request)
    #       expect(response.content_type).to match(a_string_including('application/json'))
    #     end
    #   end
    # end

    describe 'DELETE /destroy' do
      it 'destroys the requested task attachment' do
        expect do
          delete "/flow/organization_manager/tasks/#{task.id}/task_attachments/#{task_attachments.id}", headers: valid_headers
        end.to change(Flow::TaskAttachment.kept, :count).by(-1)
      end
    end
  end
end
