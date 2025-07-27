require 'rails_helper'

RSpec.describe 'Flow::ProcedureAttachmentSignature', type: :request do
  let!(:task_attachment_signature) { create(:task_attachment_signature, task_attachment: task_attachment, user: signatory_user) }
  let!(:procedure_beneficiary) { create(:procedure_beneficiary, procedure: procedure) }
  let!(:task_attachment) { create(:task_attachments, task: task) }
  let!(:task_assignment) { create(:task_assignment, task: task, user: user) }
  let(:task) { create(:task, procedure: procedure) }
  let(:signatory_user) { create(:user) }
  let(:procedure) { create(:procedure, department: department) }
  let(:department) { create(:department, organization: organization) }
  let(:organization) { create(:organization) }
  let(:user) { create(:user) }
  let(:valid_headers) {
    { 'Authorization' => "Bearer #{user.token}" }
  }

  describe 'when the user is an department member' do
    let!(:department_member_role) { create(:role, :department_member, user: user, department: department) }

    describe 'GET /flow/department_member/task_attachments/:task_attachment_id/task_attachment_signatures' do
      it 'returns the procedure attachment signatures' do
        get "/flow/department_member/task_attachment_signatures", headers: valid_headers

        expect(JSON.parse(response.body)).to match_array([include(
          'id'                                => task_attachment_signature.id,
          'task_attachment_id'                => task_attachment.id,
          'user_id'                           => signatory_user.id,
          'created_at'                        => task_attachment_signature.created_at.iso8601(3),
          'updated_at'                        => task_attachment_signature.updated_at.iso8601(3),
          'signed_at'                         => task_attachment_signature.signed_at,
          'signature'                         => task_attachment_signature.signature,
          'status'                            => task_attachment_signature.status,
          'user'                              => {
            'name' => signatory_user.name
          },
        )])
      end
    end

    describe 'POST /flow/department_member/task_attachment/:task_attachment_id/task_attachment_signatures' do
      it 'creates a new task attachment signature' do
        expect do
          post "/flow/department_member/task_attachments/#{task_attachment.id}/task_attachment_signatures", params: { user_id: user.id }, headers: valid_headers
        end.to change(Flow::TaskAttachmentSignature, :count).by(1)
      end

      it 'renders a JSON response with the task attachment signature' do
        post "/flow/department_member/task_attachments/#{task_attachment.id}/task_attachment_signatures", params: { user_id: user.id }, headers: valid_headers

        expect(response).to have_http_status(:created)

        task_attachment_signature = JSON.parse(response.body)['id']
        task_attachment_signature = Flow::TaskAttachmentSignature.find(task_attachment_signature)

        expect(JSON.parse(response.body)).to include(
          'id'                      => task_attachment_signature.id,
          'task_attachment_id'      => task_attachment.id,
          'user_id'                 => user.id,
          'signature'               => task_attachment_signature.signature,
          'status'                  => task_attachment_signature.status,
          'created_at'              => task_attachment_signature.created_at.iso8601(3),
          'updated_at'              => task_attachment_signature.updated_at.iso8601(3)
        )
      end
    end

    describe 'GET /flow/department_member/task_attachment/:task_attachment_id/task_attachment_signatures/:id' do
      let!(:department_member_role) { create(:role, :department_member, user: user, department: department) }
      it 'renders a JSON response with the task attachment signature'do
        get "/flow/department_member/task_attachments/#{task_attachment.id}/task_attachment_signatures/#{task_attachment_signature.id}", headers: valid_headers

        expect(JSON.parse(response.body)).to include(
          'id'                      => task_attachment_signature.id,
          'task_attachment_id'      => task_attachment.id,
          'user_id'                 => signatory_user.id,
          'signature'               => task_attachment_signature.signature,
          'created_at'              => task_attachment_signature.created_at.iso8601(3),
          'updated_at'              => task_attachment_signature.updated_at.iso8601(3)
        )
      end
    end
  end
end
