require 'rails_helper'

RSpec.describe "Roles", type: :request do
  let(:user) { create(:user, :admin) }
  let(:authorization_headers) do
    { 'Authorization' => "Bearer #{user.token}" }
  end
  let(:organization) { create(:organization) }
  let(:department) { create(:department, organization: organization) }
  let(:directory) { create(:directory, department: department) }
  let(:user2) { create(:user, :admin) }
  let(:document) { create(:document, directory: directory, department: department) }

  
  describe "GET /roles" do
    let!(:role) { create(:role, organization: organization, user: user, type: Roles::OrganizationManager) }

    it "returns the list of roles" do

      get "/roles", :headers => authorization_headers

      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body)).to include('id' => role.id,
                                                   'user_id' => role.user_id,
                                                   'type' => 'ORGANIZATION_MANAGER',
                                                   'organization_id' => role.organization_id,
                                                   'department_id' => role.department_id,
                                                   'created_at' => role.created_at.iso8601(3),
                                                   'updated_at' => role.updated_at.iso8601(3))
      end
  end

  describe "POST /roles" do
    it "returns the new role" do
      post "/roles", :params => { role: { type: 'ORGANIZATION_MANAGER', user_id: user.id, organization_id: organization.id } }, :headers => authorization_headers

      expect(response).to have_http_status(:created)
      role_id = JSON.parse(response.body)['id']
      expect(JSON.parse(response.body)).to  include('id' => Role.find(role_id).id,
                                                    'user_id' => Role.find(role_id).user_id,
                                                    'type' => 'ORGANIZATION_MANAGER',
                                                    'organization_id' => Role.find(role_id).organization_id,
                                                    'department_id' => Role.find(role_id).department_id,
                                                    'created_at' => Role.find(role_id).created_at.iso8601(3),
                                                    'updated_at' => Role.find(role_id).updated_at.iso8601(3))
    end

    context "when create a role for the same user" do
      context "when created with the same department" do
        let!(:role) { create(:role, department: department, user: user, type: Roles::DEPARTMENT_MEMBER) }
        it "returns the new role" do

          post "/roles", :params => { role: { type: 'DEPARTMENT_MEMBER', user_id: user.id, department_id: department.id } }, :headers => authorization_headers
          
          expect(JSON.parse(response.body)['message']).to eq('A validação falhou: usuário já adicionado')
        end
      end
    end

    context "when create a role for the same user" do
      context "when created with the same organization" do
        let!(:role) { create(:role, organization: organization, user: user, type: Roles::ORGANIZATION_MANAGER) }
        it "returns the new role" do

          post "/roles", :params => { role: { type: 'ORGANIZATION_MANAGER', user_id: user.id, organization_id: organization.id } }, :headers => authorization_headers
          
          expect(JSON.parse(response.body)['message']).to eq('A validação falhou: usuário já adicionado')
        end
      end
    end
  end

  describe "DELETE /roles/:id" do
    let!(:role) { create(:role, organization: organization, user: user, type: Roles::ORGANIZATION_MANAGER) }
    it "returns the deleted role" do
      delete "/roles/#{role.id}", :headers => authorization_headers

      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body)).to include('id' => role.id,
                                                   'user_id' => role.user_id,
                                                   'type' => 'ORGANIZATION_MANAGER',
                                                   'organization_id' => role.organization_id,
                                                   'department_id' => role.department_id,
                                                   'created_at' => role.created_at.iso8601(3),
                                                   'updated_at' => role.updated_at.iso8601(3))
    end
  end

  describe "DELETE /roles?user_id=user.id&name=role.name" do
    let!(:organization_1) { create(:organization) }
    let!(:organization_2) { create(:organization) }
    let!(:role_2) { create(:role, :organization_manager,  user: user, organization_id: organization_1.id) }
    let!(:role_3) { create(:role, :organization_manager,  user: user, organization_id: organization_2.id) }
    it "returns the deleted roles" do

      expect_result = JSON.parse(user.roles.organization_manager.to_json)
      
      delete "/roles?user_id=#{user.id}&type=#{'ORGANIZATION_MANAGER'}", :headers => authorization_headers

      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body)).to include('id' => role_3.id,
                                                   'user_id' => role_3.user_id,
                                                   'type' => 'ORGANIZATION_MANAGER',
                                                   'organization_id' => role_3.organization_id,
                                                   'department_id' => role_3.department_id,
                                                   'created_at' => role_3.created_at.iso8601(3),
                                                   'updated_at' => role_3.updated_at.iso8601(3))
    end


    context 'when the user has shared documents' do
      it 'destroys all shared documents' do
        role = create(:role, :organization_manager, user: user, organization: organization)
        create(:permission, document: document, user: user, permission_granted_by: user2, scope: :writer)
        expect do
          delete "/roles/#{role.id}", headers: authorization_headers, as: :json
        end.to change(user.permissions, :count).by(-1)
      end
    end
  end
end
