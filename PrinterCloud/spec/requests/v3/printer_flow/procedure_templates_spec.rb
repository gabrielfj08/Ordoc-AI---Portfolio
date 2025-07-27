require 'rails_helper'

RSpec.describe 'PrinterFlow::ProcedureTemplate', type: :request do
  let(:user) { create(:printer_cloud_user, :with_policies) }
  let!(:procedure_template) { create(:printer_flow_procedure_template, organization: user.organization) }

  let(:credentials) do
    { 'Authorization' => "Bearer #{user.token}",
      'X-Api-Subdomain' => user.organization.subdomain }
  end

  describe 'GET /v3/printer_flow/procedure_templates' do
    it 'responds with status ok' do
      get '/v3/printer_flow/procedure_templates', headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'renders a JSON with all procedure templates' do
      get '/v3/printer_flow/procedure_templates', headers: credentials

      expect(JSON.parse(response.body)).to include(
        'printer_flow/procedure_templates' => [{
          'id' => procedure_template.id,
          'name' => procedure_template.name,
          'status' => procedure_template.status,
          'source' => procedure_template.source,
          'organization_id' => procedure_template.organization_id,
          'parent_procedure_template_id' => procedure_template.parent_procedure_template_id,
          'group_requester_id' => procedure_template.group_requester_id,
          'prn' => procedure_template.prn,
          'created_at' => procedure_template.created_at.iso8601(3),
          'updated_at' => procedure_template.updated_at.iso8601(3),
          'children_count' => procedure_template.children_count
        }],
        'meta' => { 'total' => 1 }
      )
    end
  end

  describe 'GET /v3/printer_flow/procedure_templates/:id' do
    it 'responds with status ok' do
      get "/v3/printer_flow/procedure_templates/#{procedure_template.id}", headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'renders a JSON with the procedure template' do
      get "/v3/printer_flow/procedure_templates/#{procedure_template.id}", headers: credentials

      expect(JSON.parse(response.body)).to include(
        'id' => procedure_template.id,
        'name' => procedure_template.name,
        'status' => procedure_template.status,
        'source' => procedure_template.source,
        'organization_id' => procedure_template.organization_id,
        'parent_procedure_template_id' => procedure_template.parent_procedure_template_id,
        'group_requester_id' => procedure_template.group_requester_id,
        'prn' => procedure_template.prn,
        'created_at' => procedure_template.created_at.iso8601(3),
        'updated_at' => procedure_template.updated_at.iso8601(3),
        'group_requester' => nil
      )
    end
  end

  describe 'POST /v3/printer_flow/procedure_templates/:id' do
    let(:create_params) do
      {
        procedure_template: {
          name: 'Marmita',
          group_requester_id: nil,
          parent_procedure_template_id: nil,
          source: 'internal_external'
        }
      }
    end
    it 'responds with status ok' do
      post '/v3/printer_flow/procedure_templates', params: create_params, headers: credentials

      expect(response).to have_http_status(:created)
    end

    it 'renders a JSON with the created procedure template' do
      post '/v3/printer_flow/procedure_templates', params: create_params, headers: credentials

      procedure_template_id = JSON.parse(response.body)['id']
      procedure_template = PrinterFlow::ProcedureTemplate.find(procedure_template_id)

      expect(JSON.parse(response.body)).to include(
        'id' => procedure_template.id,
        'name' => procedure_template.name,
        'status' => procedure_template.status,
        'source' => procedure_template.source,
        'organization_id' => procedure_template.organization_id,
        'parent_procedure_template_id' => procedure_template.parent_procedure_template_id,
        'group_requester_id' => procedure_template.group_requester_id,
        'prn' => procedure_template.prn,
        'created_at' => procedure_template.created_at.iso8601(3),
        'updated_at' => procedure_template.updated_at.iso8601(3),
        'group_requester' => nil
      )
    end
  end

  describe 'PUT /v3/printer_flow/procedure_templates/:id/deactivate' do
    let(:params) do
      { note: 'Desativado por inatividade' }
    end

    it 'responds with status ok' do
      put "/v3/printer_flow/procedure_templates/#{procedure_template.id}/deactivate", params: params,
                                                                                      headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'renders a JSON with deactivated procedure template' do
      put "/v3/printer_flow/procedure_templates/#{procedure_template.id}/deactivate", params: params,
                                                                                      headers: credentials

      procedure_template.reload

      expect(JSON.parse(response.body)).to include(
        'id' => procedure_template.id,
        'name' => procedure_template.name,
        'status' => procedure_template.status,
        'source' => procedure_template.source,
        'organization_id' => procedure_template.organization_id,
        'parent_procedure_template_id' => procedure_template.parent_procedure_template_id,
        'group_requester_id' => procedure_template.group_requester_id,
        'prn' => procedure_template.prn,
        'created_at' => procedure_template.created_at.iso8601(3),
        'updated_at' => procedure_template.updated_at.iso8601(3),
        'group_requester' => nil
      )
    end
  end

  describe 'PUT /v3/printer_flow/procedure_templates/:id/activate' do
    let(:procedure_template) do
      create(:printer_flow_procedure_template, organization: user.organization, status: 'inactive')
    end

    it 'responds with status ok' do
      put "/v3/printer_flow/procedure_templates/#{procedure_template.id}/activate", headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'renders a JSON with activated procedure template' do
      put "/v3/printer_flow/procedure_templates/#{procedure_template.id}/activate", headers: credentials

      procedure_template.reload

      expect(JSON.parse(response.body)).to include(
        'id' => procedure_template.id,
        'name' => procedure_template.name,
        'status' => procedure_template.status,
        'source' => procedure_template.source,
        'organization_id' => procedure_template.organization_id,
        'parent_procedure_template_id' => procedure_template.parent_procedure_template_id,
        'group_requester_id' => procedure_template.group_requester_id,
        'prn' => procedure_template.prn,
        'created_at' => procedure_template.created_at.iso8601(3),
        'updated_at' => procedure_template.updated_at.iso8601(3),
        'group_requester' => nil
      )
    end
  end

  describe 'PUT /v3/printer_flow/procedure_templates/:id' do
    let(:update_params) do
      {
        procedure_template: {
          name: 'Memorando V2',
          group_requester_id: nil,
          source: 'internal_external'
        }
      }
    end
    it 'responds with status ok' do
      put "/v3/printer_flow/procedure_templates/#{procedure_template.id}", params: update_params, headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'renders a JSON with updated procedure template' do
      put "/v3/printer_flow/procedure_templates/#{procedure_template.id}", params: update_params, headers: credentials

      procedure_template.reload

      expect(JSON.parse(response.body)).to include(
        'id' => procedure_template.id,
        'name' => procedure_template.name,
        'status' => procedure_template.status,
        'source' => procedure_template.source,
        'organization_id' => procedure_template.organization_id,
        'parent_procedure_template_id' => procedure_template.parent_procedure_template_id,
        'group_requester_id' => procedure_template.group_requester_id,
        'prn' => procedure_template.prn,
        'created_at' => procedure_template.created_at.iso8601(3),
        'updated_at' => procedure_template.updated_at.iso8601(3),
        'group_requester' => nil
      )
    end
  end
end
