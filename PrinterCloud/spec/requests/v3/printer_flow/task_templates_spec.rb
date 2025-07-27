require 'rails_helper'

RSpec.describe 'PrinterFlow::TaskTemplate', type: :request do
  let!(:task_template) { create(:task_template, organization: user.organization) }
  let(:user) { create(:printer_cloud_user, :with_policies) }

  let(:credentials) do
    { 'Authorization' => "Bearer #{user.token}",
      'X-Api-Subdomain' => user.organization.subdomain }
  end

  describe 'GET /v3/printer_flow/task_templates' do
    it 'responds with status ok' do
      get '/v3/printer_flow/task_templates', headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'renders a JSON with all task templates' do
      get '/v3/printer_flow/task_templates', headers: credentials

      expect(JSON.parse(response.body)).to include(
        'printer_flow/task_templates' => [{
          'id' => task_template.id,
          'name' => task_template.name,
          'description' => task_template.description,
          'status' => task_template.status,
          'organization_id' => task_template.organization_id,
          'prn' => task_template.prn,
          'created_at' => task_template.created_at.iso8601(3),
          'updated_at' => task_template.updated_at.iso8601(3)
        }],
        'meta' => { 'total' => 1 }
      )
    end
  end

  describe 'GET /v3/printer_flow/task_templates/:id' do
    it 'responds with status ok' do
      get "/v3/printer_flow/task_templates/#{task_template.id}", headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'renders a JSON with the task template' do
      get "/v3/printer_flow/task_templates/#{task_template.id}", headers: credentials

      expect(JSON.parse(response.body)).to include(
        'id' => task_template.id,
        'name' => task_template.name,
        'description' => task_template.description,
        'status' => task_template.status,
        'organization_id' => task_template.organization_id,
        'prn' => task_template.prn,
        'task_fields' => task_template.task_fields,
        'created_at' => task_template.created_at.iso8601(3),
        'updated_at' => task_template.updated_at.iso8601(3)
      )
    end
  end

  describe 'POST /v3/printer_flow/task_templates/:id' do
    let(:create_params) do
      {
        task_template: {
          name: 'Assinaturas',
          description: 'Assinatura para compra de equipamentos'
        }
      }
    end
    it 'responds with status ok' do
      post '/v3/printer_flow/task_templates', params: create_params, headers: credentials

      expect(response).to have_http_status(:created)
    end

    it 'renders a JSON with the created task template' do
      post '/v3/printer_flow/task_templates', params: create_params, headers: credentials

      task_template_id = JSON.parse(response.body)['id']
      task_template = ::PrinterFlow::TaskTemplate.find(task_template_id)

      expect(JSON.parse(response.body)).to include(
        'id' => task_template.id,
        'name' => task_template.name,
        'description' => task_template.description,
        'status' => task_template.status,
        'organization_id' => task_template.organization_id,
        'prn' => task_template.prn,
        'task_fields' => task_template.task_fields,
        'created_at' => task_template.created_at.iso8601(3),
        'updated_at' => task_template.updated_at.iso8601(3)
      )
    end
  end

  describe 'PUT /v3/printer_flow/task_templates/:id/deactivate' do
    let(:params) do
      { note: 'Desativado por inatividade' }
    end

    it 'responds with status ok' do
      put "/v3/printer_flow/task_templates/#{task_template.id}/deactivate", params: params,
                                                                            headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'renders a JSON with deactivated task template' do
      put "/v3/printer_flow/task_templates/#{task_template.id}/deactivate", params: params,
                                                                            headers: credentials

      task_template.reload

      expect(JSON.parse(response.body)).to include(
        'id' => task_template.id,
        'name' => task_template.name,
        'description' => task_template.description,
        'status' => task_template.status,
        'organization_id' => task_template.organization_id,
        'prn' => task_template.prn,
        'created_at' => task_template.created_at.iso8601(3),
        'updated_at' => task_template.updated_at.iso8601(3)
      )
    end
  end

  describe 'PUT /v3/printer_flow/task_templates/:id/activate' do
    let(:task_template) do
      create(:task_template, :inactive, organization: user.organization)
    end

    it 'responds with status ok' do
      put "/v3/printer_flow/task_templates/#{task_template.id}/activate", headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'renders a JSON with activated task template' do
      put "/v3/printer_flow/task_templates/#{task_template.id}/activate", headers: credentials

      task_template.reload

      expect(JSON.parse(response.body)).to include(
        'id' => task_template.id,
        'name' => task_template.name,
        'description' => task_template.description,
        'status' => task_template.status,
        'organization_id' => task_template.organization_id,
        'prn' => task_template.prn,
        'created_at' => task_template.created_at.iso8601(3),
        'updated_at' => task_template.updated_at.iso8601(3)
      )
    end
  end

  describe 'PUT /v3/printer_flow/task_templates/:id' do
    let(:update_params) do
      {
        'task_template' => {
          'name' => 'Rastreio de entrega',
          'description' => 'entregar'
        }
      }
    end
    it 'responds with status ok' do
      put "/v3/printer_flow/task_templates/#{task_template.id}", params: update_params, headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'renders a JSON with updated task template' do
      put "/v3/printer_flow/task_templates/#{task_template.id}", params: update_params, headers: credentials

      task_template.reload

      expect(JSON.parse(response.body)).to include(
        'id' => task_template.id,
        'name' => task_template.name,
        'description' => task_template.description,
        'status' => task_template.status,
        'organization_id' => task_template.organization_id,
        'prn' => task_template.prn,
        'task_fields' => task_template.task_fields,
        'created_at' => task_template.created_at.iso8601(3),
        'updated_at' => task_template.updated_at.iso8601(3)
      )
    end
  end
end
