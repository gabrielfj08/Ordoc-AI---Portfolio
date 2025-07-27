require 'rails_helper'

RSpec.describe 'Flow::ProcedureTemplateAttachment', type: :request do
  let(:organization) { create(:organization) }
  let(:user) { create(:user) }
  let!(:organization_manager_role) { create(:role, :organization_manager, user: user, organization: organization) }
  let!(:procedure_template_attachment) { create(:procedure_template_attachment, procedure_template: procedure_template) }
  let!(:procedure_template) { create(:procedure_template, organization: organization) }
  let(:file) { fixture_file_upload('file.png') }
  let(:valid_headers) {
    { 'Authorization' => "Bearer #{user.token}" }
  }

  let(:valid_attributes) {
    {
      file: file
    }
  }

  describe 'when user is organization manager' do
    describe 'GET /flow/organization_manager/procedure_templates/:id/procedure_template_attachments' do
      it 'returns all procedure template attachments' do
        get "/flow/organization_manager/procedure_templates/#{procedure_template.id}/procedure_template_attachments", headers: valid_headers

        expect(JSON.parse(response.body)).to include(
          "id"                    => procedure_template_attachment.id,
          "name"                  => procedure_template_attachment.name,
          "created_at"            => procedure_template_attachment.created_at.iso8601(3),
          "updated_at"            => procedure_template_attachment.updated_at.iso8601(3),
          "procedure_template_id" => procedure_template_attachment.procedure_template_id,
          "url"                   => Rails.application.routes.url_helpers.rails_blob_path(procedure_template_attachment.file.attachment, only_path: true) 
        )
      end
    end

    describe 'GET /flow/organization_manager/procedure_templates/:procedure_template_id/procedure_template_attachments/:id' do
      it 'returns a procedure template attachment' do
        get "/flow/organization_manager/procedure_templates/#{procedure_template.id}/procedure_template_attachments/#{procedure_template_attachment.id}", headers: valid_headers

        expect(JSON.parse(response.body)).to include(
          "id"                    => procedure_template_attachment.id,
          "name"                  => procedure_template_attachment.name,
          "created_at"            => procedure_template_attachment.created_at.iso8601(3),
          "updated_at"            => procedure_template_attachment.updated_at.iso8601(3),
          "procedure_template_id" => procedure_template_attachment.procedure_template_id,
          "url"                   => Rails.application.routes.url_helpers.rails_blob_path(procedure_template_attachment.file.attachment, only_path: true) 
        )
      end
    end

    describe 'POST /flow/:role/procedure_templates/:id/procedure_template_attachments' do
      it 'creates an attachment in procedure template' do
        expect do
          post "/flow/organization_manager/procedure_templates/#{procedure_template.id}/procedure_template_attachments",
                params: { procedure_template_attachment: valid_attributes }, headers: valid_headers
        end.to change(Flow::ProcedureTemplateAttachment, :count).by(1)
      end

      it 'renders JSON with the created procedure template attachment' do
        post "/flow/organization_manager/procedure_templates/#{procedure_template.id}/procedure_template_attachments",
             params: { procedure_template_attachment: valid_attributes }, headers: valid_headers
        expect(response).to have_http_status(:created)

        procedure_template_attachment_id = JSON.parse(response.body)['id']
        procedure_template_attachment = Flow::ProcedureTemplateAttachment.find(procedure_template_attachment_id)

        expect(JSON.parse(response.body)).to include(
          "id"                    => procedure_template_attachment.id,
          "name"                  => procedure_template_attachment.name,
          "created_at"            => procedure_template_attachment.created_at.iso8601(3),
          "updated_at"            => procedure_template_attachment.updated_at.iso8601(3),
          "procedure_template_id" => procedure_template_attachment.procedure_template_id,
          "url"                   => Rails.application.routes.url_helpers.rails_blob_path(procedure_template_attachment.file.attachment, only_path: true) 
        )
      end
    end

    describe 'DELETE /flow/organization_manager/procedure_templates/:procedure_template_id/procedure_template_attachments/:id' do
      it 'deletes procedure template attachment' do
        expect do
          delete "/flow/organization_manager/procedure_templates/#{procedure_template.id}/procedure_template_attachments/#{procedure_template_attachment.id}", headers: valid_headers
        end.to change(Flow::ProcedureTemplateAttachment, :count).by(-1)
      end
    end
  end
end
