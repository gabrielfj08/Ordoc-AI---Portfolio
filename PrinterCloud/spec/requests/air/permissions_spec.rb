require 'rails_helper'

RSpec.describe 'Permissions', type: :request do
  let!(:user) { create(:user) }
  let(:authorization_headers) do
    { 'Authorization' => "Bearer #{user.token}" }
  end
  let!(:department_member) { create(:role, type: Roles::DEPARTMENT_MEMBER, user: user, department: department) }
  let(:organization) { create(:organization, :with_recycle_bin) }
  let(:organization2) { create(:organization) }
  let!(:department) { create(:department, organization: organization) }
  let(:directory) { create(:directory, department: department) }
  let(:document) { create(:document, directory: directory, department: department) }
  let(:user2) { create(:user) }
  let!(:role) { create(:role, type: Roles::ORGANIZATION_MEMBER, organization: organization, user: user2) }
  let(:user3) { create(:user) }
  let!(:role2) { create(:role, :organization_manager, organization: organization2, user: user3) }
  let!(:permission) do
    create(:permission, user: user2, document_id: document.id, permission_granted_by: user, scope: 0)
  end

  describe 'GET /index' do
    it 'renders a successful response' do
      get "/air/department_member/documents/#{document.id}/permissions/", headers: authorization_headers, as: :json
      expect(response).to be_successful
      expect(JSON.parse(response.body)).to match_array([include('id' => permission.id)])
    end
  end

  describe 'POST /create' do
    context 'with valid parameters' do
      let(:params) do
        {
          user_id: user2.id,
          directory_id: directory.id,
          scope: 1
        }
      end
      it 'creates a new Permission' do
        expect do
          post "/air/department_member/directories/#{directory.id}/permissions", params: params,
                                                                                 headers: authorization_headers, as: :json
        end.to change(directory.permissions, :count).by(1)
        expect(response).to have_http_status(:created)
      end
    end

    context 'with user_id equals permission_granted_by_id' do
      let(:params) do
        {
          user_id: user.id,
          document_id: document.id,
          scope: 1
        }
      end
      it 'returns error message' do
        post "/air/department_member/documents/#{document.id}/permissions", params: params,
                                                                            headers: authorization_headers, as: :json
        expect(JSON.parse(response.body)).to include(
          'error' => 'unprocessable_entity',
          'message' => 'A validação falhou: usuário inválido(a), usuário deve ser membro da organização',
          'status' => 422
        )
      end
    end

    context 'when user does not have access to the organization' do
      let(:params) do
        {
          user_id: user3.id,
          document_id: document.id,
          scope: 1
        }
      end
      it 'returns error message' do
        post "/air/department_member/documents/#{document.id}/permissions", params: params,
                                                                            headers: authorization_headers, as: :json
        expect(JSON.parse(response.body)).to include(
          'error' => 'unprocessable_entity',
          'message' => 'A validação falhou: usuário deve ser membro da organização',
          'status' => 422
        )
      end
    end
  end

  describe 'PUT /update' do
    context 'with valid parameters' do
      it 'updates the requested permission' do
        valid_attributes = {
          scope: 1
        }
        put "/air/department_member/documents/#{document.id}/permissions/#{permission.id}", params: { permission: valid_attributes },
                                                                                            headers: authorization_headers, as: :json

        expect(JSON.parse(response.body)).to include('id' => permission.id)
      end
    end
  end

  describe 'DELETE /destroy' do
    it 'destroys the requested permission' do
      expect do
        delete "/air/department_member/documents/#{document.id}/permissions/#{permission.id}",
               headers: authorization_headers, as: :json
      end.to change(Permission, :count).by(-1)
    end
  end
end
