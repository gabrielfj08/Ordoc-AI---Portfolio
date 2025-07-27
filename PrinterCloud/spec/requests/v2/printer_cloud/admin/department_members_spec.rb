require 'rails_helper'

RSpec.describe 'Department Members', type: :request do
  let(:organization) { create(:organization) }
  let(:user) { create(:user, :admin) }
  let(:authorization_headers) do
    { 'Authorization' => "Bearer #{user.token}" }
  end

  describe 'GET /v2/printer_cloud/admin/department_members' do
    let(:member) { create(:user) }
    let!(:role) { create(:role, type: Roles::DEPARTMENT_MEMBER, organization: organization, user: member) }
    let(:params)do
    {
      organization_id: organization.id
    }
    end

    it 'responds with status ok' do
      get '/v2/printer_cloud/admin/department_members', params: params, headers: authorization_headers

      expect(response).to have_http_status(:ok)
    end

    it 'returns all members from department' do
      get '/v2/printer_cloud/admin/department_members', params: params, headers: authorization_headers

      expect(JSON.parse(response.body)). to include(
        'users' => [{
          'id'            => member.id,
          'name'          => member.name,
          'email'         => member.email,
          'cpf'           => member.cpf,
          'phone'         => member.phone,
          'date_of_birth' => '2021-01-15',
          'status'        => member.status,
          'created_at'    => member.created_at.iso8601(3),
          'updated_at'    => member.updated_at.iso8601(3),
          'deleted_at'    => member.deleted_at,
        }], 
        'meta' => { 
          'total' => 1,
        },
      )
    end
  end
end
