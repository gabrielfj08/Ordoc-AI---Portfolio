require 'rails_helper'

RSpec.describe 'PrinterFlow::TaskField', type: :request do
  let!(:task_field) { create(:task_field, fieldable: task_template) }
  let(:user) { create(:printer_cloud_user, :with_policies) }
  let(:task_template) { create(:task_template, organization: user.organization) }

  let(:credentials) do
    { 'Authorization' => "Bearer #{user.token}",
      'X-Api-Subdomain' => user.organization.subdomain }
  end

  describe 'GET /v3/printer_flow/task_templates/:task_template_id/task_fields' do
    it 'responds with status ok' do
      get "/v3/printer_flow/task_templates/#{task_template.id}/task_fields", headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'renders a JSON with all task fields' do
      get "/v3/printer_flow/task_templates/#{task_template.id}/task_fields", headers: credentials

      expect(JSON.parse(response.body)).to include(
        'printer_flow/task_fields' => [{
          'id' => task_field.id,
          'label' => task_field.label,
          'field_type' => task_field.field_type,
          'fieldable_id' => task_field.fieldable_id,
          'fieldable_type' => task_field.fieldable_type,
          'options' => task_field.options,
          'value' => task_field.value,
          'array_values' => task_field.array_values,
          'created_at' => task_field.created_at.iso8601(3),
          'updated_at' => task_field.updated_at.iso8601(3)
        }],
        'meta' => {
          'total' => 1

        }
      )
    end
  end

  describe 'GET /v3/printer_flow/task_field_types' do
    it 'responds with status ok' do
      get '/v3/printer_flow/task_field_types', headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'renders a JSON with all task field types' do
      get '/v3/printer_flow/task_field_types', headers: credentials

      expect({ 'field_types' =>
        %w[short_text
           long_text
           numeric
           select_field
           date
           time
           checkbox
           phone
           email
           radio
           cpf
           cnpj] })
    end
  end

  describe 'GET /v3/printer_flow/task_templates/:task_template_id/task_fields/:id' do
    it 'responds with status ok' do
      get "/v3/printer_flow/task_templates/#{task_template.id}/task_fields/#{task_field.id}",
          headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'renders a JSON with the task field' do
      get "/v3/printer_flow/task_templates/#{task_template.id}/task_fields/#{task_field.id}",
          headers: credentials

      expect(JSON.parse(response.body)).to include(
        {
          'id' => task_field.id,
          'label' => task_field.label,
          'field_type' => task_field.field_type,
          'fieldable_id' => task_field.fieldable_id,
          'fieldable_type' => task_field.fieldable_type,
          'options' => task_field.options,
          'value' => task_field.value,
          'array_values' => task_field.array_values,
          'created_at' => task_field.created_at.iso8601(3),
          'updated_at' => task_field.updated_at.iso8601(3)
        }
      )
    end
  end

  describe 'POST /v3/printer_flow/task_templates/:task_template_id/task_fields' do
    let(:create_params) do
      {
        task_field: { label: 'Numeric',
                      field_type: 'numeric' }
      }
    end

    it 'responds with status ok' do
      post "/v3/printer_flow/task_templates/#{task_template.id}/task_fields", params: create_params,
                                                                              headers: credentials

      expect(response).to have_http_status(:created)
    end

    it 'renders a JSON with created task field' do
      post "/v3/printer_flow/task_templates/#{task_template.id}/task_fields", params: create_params,
                                                                              headers: credentials

      task_field_id = JSON.parse(response.body)['id']
      task_field = ::PrinterFlow::TaskField.find(task_field_id)

      expect(JSON.parse(response.body)).to include(
        {
          'id' => task_field.id,
          'label' => task_field.label,
          'field_type' => task_field.field_type,
          'fieldable_id' => task_field.fieldable_id,
          'fieldable_type' => task_field.fieldable_type,
          'options' => task_field.options,
          'value' => task_field.value,
          'array_values' => task_field.array_values,
          'created_at' => task_field.created_at.iso8601(3),
          'updated_at' => task_field.updated_at.iso8601(3)
        }
      )
    end
  end

  describe 'PUT /v3/printer_flow/task_templates/:task_template_id/task_fields/:id' do
    let(:update_params) do
      { task_field: { label: 'Minha História' } }
    end

    it 'responds with status ok' do
      put "/v3/printer_flow/task_templates/#{task_template.id}/task_fields/#{task_field.id}", params: update_params,
                                                                                              headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'renders a JSON with updated task field' do
      put "/v3/printer_flow/task_templates/#{task_template.id}/task_fields/#{task_field.id}", params: update_params,
                                                                                              headers: credentials

      task_field.reload

      expect(JSON.parse(response.body)).to include(
        {
          'id' => task_field.id,
          'label' => task_field.label,
          'field_type' => task_field.field_type,
          'fieldable_id' => task_field.fieldable_id,
          'fieldable_type' => task_field.fieldable_type,
          'options' => task_field.options,
          'value' => task_field.value,
          'array_values' => task_field.array_values,
          'created_at' => task_field.created_at.iso8601(3),
          'updated_at' => task_field.updated_at.iso8601(3)
        }
      )
    end
  end

  describe 'DELETE /v3/printer_flow/task_templates/:task_template_id/task_fields/:id' do
    it 'responds with status ok' do
      delete "/v3/printer_flow/task_templates/#{task_template.id}/task_fields/#{task_field.id}",
             headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'renders a JSON with destroyed task field' do
      delete "/v3/printer_flow/task_templates/#{task_template.id}/task_fields/#{task_field.id}",
             headers: credentials

      expect(JSON.parse(response.body)).to include(
        {
          'id' => task_field.id,
          'label' => task_field.label,
          'field_type' => task_field.field_type,
          'fieldable_id' => task_field.fieldable_id,
          'fieldable_type' => task_field.fieldable_type,
          'options' => task_field.options,
          'value' => task_field.value,
          'array_values' => task_field.array_values,
          'created_at' => task_field.created_at.iso8601(3),
          'updated_at' => task_field.updated_at.iso8601(3)
        }
      )
    end
  end
end
