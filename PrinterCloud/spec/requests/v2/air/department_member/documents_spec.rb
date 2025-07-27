require 'rails_helper'

RSpec.describe 'Documents', type: :request do
  let(:department) { create(:department) }
  let(:document) { create(:document, department: department) }
  let(:user) { create(:user) }
  let!(:department_member_role) { create(:role, :department_member, user: user, department: department) }
  let(:document_params) {
    {
      original_filename: 'new name',
      description: 'new description',
      location: 'new location',
    }
  }
  let(:authorization_headers) do
    { 'Authorization' => "Bearer #{user.token}" }
  end

  describe 'PUT /v2/air/department_member/departments/:department_id/documents/:id' do
    it 'responds with status ok' do
      put "/v2/air/department_member/departments/#{department.id}/documents/#{document.id}", headers: authorization_headers, params: { document: document_params }

      expect(response).to have_http_status(:ok)
    end

    it 'renders a JSON response with the department' do
      put "/v2/air/department_member/departments/#{department.id}/documents/#{document.id}", headers: authorization_headers, params: { document: document_params }

      document.reload

      expect(JSON.parse(response.body)).to include(
        'created_at'      => document.created_at.iso8601(3),
        'updated_at'      => document.updated_at.iso8601(3),
        'id'              => document.id,
        'status'          => document.status,
        'description'     => document.description,
        'location'        => document.location,
        'directory_id'    => document.directory_id,
        'path'            => document.path,
        'url'             => document.url,
        'size'            => document.size,
        'department_id'   => document.department_id,
      )
    end
  end
end
