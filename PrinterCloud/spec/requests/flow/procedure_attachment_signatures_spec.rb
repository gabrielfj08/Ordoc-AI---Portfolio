require 'rails_helper'

RSpec.describe 'Flow::ProcedureAttachmentSignature', type: :request do
  let!(:procedure_attachment_signature) { create(:procedure_attachment_signature, procedure_attachment: procedure_attachment, user: signatory_user) }
  let(:procedure_attachment) { create(:procedure_attachment, procedure: procedure) }
  let(:procedure_attachment_2) { create(:procedure_attachment, procedure: procedure) }
  let(:signatory_user) { create(:user) }
  let(:procedure) { create(:procedure, department: department) }
  let(:department) { create(:department, organization: organization) }
  let(:organization) { create(:organization) }
  let(:user) { create(:user) }
  let(:valid_headers) {
    { 'Authorization' => "Bearer #{user.token}" }
  }

  describe 'when the user is an organization manager' do
    let!(:organization_manager_role) { create(:role, :organization_manager, user: user, organization: organization) }

    describe 'GET /flow/organization_manager/procedure_attachments/:procedure_attachment_id/procedure_attachment_signatures' do
      it 'returns the procedure attachment signatures' do
        get "/flow/organization_manager/procedure_attachments/#{procedure_attachment.id}/procedure_attachment_signatures", headers: valid_headers

        expect(JSON.parse(response.body)).to include(
          'id'                      => procedure_attachment_signature.id,
          'procedure_attachment_id' => procedure_attachment.id,
          'user_id'                 => signatory_user.id,
          'created_at'              => procedure_attachment_signature.created_at.iso8601(3),
          'updated_at'              => procedure_attachment_signature.updated_at.iso8601(3),
          'signature'               => procedure_attachment_signature.signature,
          'status'                  => procedure_attachment_signature.status,
          'user'                    => {
            'name' => user.name
          }
        )
      end
    end

    describe 'POST /flow/organization_manager/procedure_attachment/:procedure_attachment_id/procedure_attachment_signatures' do
      it 'creates a new procedure attachment signature' do
        expect do
          post "/flow/organization_manager/procedure_attachments/#{procedure_attachment_2.id}/procedure_attachment_signatures", headers: valid_headers
        end.to change(Flow::ProcedureAttachmentSignature, :count).by(1)
      end

      it 'renders a JSON response with the user group' do
        post "/flow/organization_manager/procedure_attachments/#{procedure_attachment_2.id}/procedure_attachment_signatures", headers: valid_headers

        expect(response).to have_http_status(:created)

        procedure_attachment_signature = JSON.parse(response.body)['id']
        procedure_attachment_signature = Flow::ProcedureAttachmentSignature.find(procedure_attachment_signature)

        expect(JSON.parse(response.body)).to include(
          'id'                      => procedure_attachment_signature.id,
          'procedure_attachment_id' => procedure_attachment_2.id,
          'user_id'                 => user.id,
          'signature'               => procedure_attachment_signature.signature,
          'created_at'              => procedure_attachment_signature.created_at.iso8601(3),
          'updated_at'              => procedure_attachment_signature.updated_at.iso8601(3)
        )
      end
    end

    describe 'GET /flow/department_member/procedure_attachments/#{procedure_attachment.id}/procedure_attachment_signatures/:id' do
      let!(:department_member_role) { create(:role, :department_member, user: user, department: department) }
      it 'renders a JSON response with the task attachment signature'do
        get "/flow/department_member/procedure_attachments/#{procedure_attachment.id}/procedure_attachment_signatures/#{procedure_attachment_signature.id}", headers: valid_headers

        expect(JSON.parse(response.body)).to include(
          'id'                      => procedure_attachment_signature.id,
          'procedure_attachment_id' => procedure_attachment.id,
          'user_id'                 => signatory_user.id,
          'signature'               => procedure_attachment_signature.signature,
          'created_at'              => procedure_attachment_signature.created_at.iso8601(3),
          'updated_at'              => procedure_attachment_signature.updated_at.iso8601(3)
        )
      end
    end
  end
end
