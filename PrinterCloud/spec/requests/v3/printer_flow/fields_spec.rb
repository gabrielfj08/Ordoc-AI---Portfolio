require 'rails_helper'

RSpec.describe 'PrinterFlow::Field', type: :request do
  let!(:field) { create(:field, field_type: 'attachment', procedure_template: procedure_template) }
  let(:user) { create(:printer_cloud_user, :with_policies) }
  let(:procedure_template) { create(:printer_flow_procedure_template, organization: user.organization) }
  let(:field_document_template) { create(:field_document_template, organization: user.organization) }

  let(:credentials) do
    { 'Authorization' => "Bearer #{user.token}",
      'X-Api-Subdomain' => user.organization.subdomain }
  end

  describe 'GET /v3/printer_flow/procedure_templates/:procedure_template_id/fields' do
    it 'responds with status ok' do
      get "/v3/printer_flow/procedure_templates/#{procedure_template.id}/fields",
          headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'renders a JSON with all fields' do
      get "/v3/printer_flow/procedure_templates/#{procedure_template.id}/fields",
          headers: credentials

      expect(JSON.parse(response.body)).to include(
        'printer_flow/fields' => [{
          'id' => field.id,
          'label' => field.label,
          'field_document_template' => field.field_document_template,
          'field_type' => field.field_type,
          'field_value_options' => field.field_value_options,
          'required' => field.required,
          'procedure_template_id' => field.procedure_template_id,
          'created_at' => field.created_at.iso8601(3),
          'updated_at' => field.updated_at.iso8601(3)
        }],
        'meta' => {
          'total' => 1

        }
      )
    end
  end

  describe 'GET /v3/printer_flow/field_types' do
    it 'responds with status ok' do
      get '/v3/printer_flow/field_types', headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'renders a JSON with all field types' do
      get '/v3/printer_flow/field_types', headers: credentials

      expect({ 'field_types' =>
        %w[short_text
           long_text
           numeric
           select_field
           date
           time
           attachment
           checkbox
           phone
           email
           radio
           cpf
           cnpj] })
    end
  end

  describe 'GET /v3/printer_flow/procedure_templates/:procedure_template_id/fields/:id' do
    it 'responds with status ok' do
      get "/v3/printer_flow/procedure_templates/#{procedure_template.id}/fields/#{field.id}",
          headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'renders a JSON with the field' do
      get "/v3/printer_flow/procedure_templates/#{procedure_template.id}/fields/#{field.id}",
          headers: credentials

      expect(JSON.parse(response.body)).to include(
        {
          'id' => field.id,
          'label' => field.label,
          'field_type' => field.field_type,
          'required' => field.required,
          'field_document_template' => field.field_document_template,
          'procedure_template_id' => field.procedure_template_id,
          'created_at' => field.created_at.iso8601(3),
          'updated_at' => field.updated_at.iso8601(3)
        }
      )
    end
  end

  describe 'POST /v3/printer_flow/procedure_templates/:procedure_template_id/fields' do
    let(:create_params) do
      { field: { label: 'data de nascimento',
                 field_type: 'date' } }
    end

    it 'responds with status ok' do
      post "/v3/printer_flow/procedure_templates/#{procedure_template.id}/fields", params: create_params,
                                                                                   headers: credentials

      expect(response).to have_http_status(:created)
    end

    it 'renders a JSON with created field' do
      post "/v3/printer_flow/procedure_templates/#{procedure_template.id}/fields", params: create_params,
                                                                                   headers: credentials

      field_id = JSON.parse(response.body)['id']
      field = PrinterFlow::Field.find(field_id)

      expect(JSON.parse(response.body)).to include(
        {
          'id' => field.id,
          'label' => field.label,
          'field_type' => field.field_type,
          'required' => field.required,
          'field_document_template' => field.field_document_template,
          'procedure_template_id' => field.procedure_template_id,
          'created_at' => field.created_at.iso8601(3),
          'updated_at' => field.updated_at.iso8601(3)
        }
      )
    end
  end

  describe 'PUT /v3/printer_flow/procedure_templates/:procedure_template_id/fields/:id' do
    let(:update_params) do
      { label: 'meu CNPJ',
        field_type: 'cnpj' }
    end

    it 'responds with status ok' do
      put "/v3/printer_flow/procedure_templates/#{procedure_template.id}/fields/#{field.id}", params: update_params,
                                                                                              headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'renders a JSON with updated field' do
      put "/v3/printer_flow/procedure_templates/#{procedure_template.id}/fields/#{field.id}", params: update_params,
                                                                                              headers: credentials

      field.reload

      expect(JSON.parse(response.body)).to include(
        {
          'id' => field.id,
          'label' => field.label,
          'field_type' => field.field_type,
          'required' => field.required,
          'field_document_template' => field.field_document_template,
          'procedure_template_id' => field.procedure_template_id,
          'created_at' => field.created_at.iso8601(3),
          'updated_at' => field.updated_at.iso8601(3)
        }
      )
    end
  end

  describe 'DELETE /v3/printer_flow/procedure_templates/:procedure_template_id/fields/:id' do
    it 'responds with status ok' do
      delete "/v3/printer_flow/procedure_templates/#{procedure_template.id}/fields/#{field.id}",
             headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'renders a JSON with destroyed field' do
      delete "/v3/printer_flow/procedure_templates/#{procedure_template.id}/fields/#{field.id}",
             headers: credentials

      expect(JSON.parse(response.body)).to include(
        {
          'id' => field.id,
          'label' => field.label,
          'field_type' => field.field_type,
          'required' => field.required,
          'field_document_template' => field.field_document_template,
          'procedure_template_id' => field.procedure_template_id,
          'created_at' => field.created_at.iso8601(3),
          'updated_at' => field.updated_at.iso8601(3)
        }
      )
    end
  end

  describe 'PUT /v3/printer_flow/fields/:field_id/attach_document_template' do
    let(:params) do
      { field_document_template_id: field_document_template.id }
    end

    it 'responds with status ok' do
      put "/v3/printer_flow/fields/#{field.id}/attach_document_template", params: params,
                                                                          headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'renders a JSON with updated field' do
      put "/v3/printer_flow/fields/#{field.id}/attach_document_template", params: params,
                                                                          headers: credentials

      field.reload

      expect(JSON.parse(response.body)).to include(
        {
          'id' => field.id,
          'label' => field.label,
          'field_type' => field.field_type,
          'required' => field.required,
          'field_document_template' => {
            'document_id' => field_document_template.document_id,
            'document_url' => field_document_template.document.url,
            'id' => field_document_template.id,
            'name' => field_document_template.name,
            'organization_id' => field_document_template.organization_id,
            's3_key' => field_document_template.s3_key,
            'status' => field_document_template.status,
            'created_at' => field_document_template.created_at.iso8601(3),
            'updated_at' => field_document_template.updated_at.iso8601(3)
          },
          'procedure_template_id' => field.procedure_template_id,
          'created_at' => field.created_at.iso8601(3),
          'updated_at' => field.updated_at.iso8601(3)
        }
      )
    end
  end

  describe 'PUT /v3/printer_flow/fields/:field_id/detach_document_template' do
    let!(:field_attachment) do
      create(:field_attachment, field: field, field_document_template: field_document_template)
    end
    let(:params) do
      { field_document_template_id: field_document_template.id }
    end

    it 'responds with status ok' do
      put "/v3/printer_flow/fields/#{field.id}/detach_document_template", params: params,
                                                                          headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'renders a JSON with updated field' do
      put "/v3/printer_flow/fields/#{field.id}/detach_document_template", params: params,
                                                                          headers: credentials

      field.reload

      expect(JSON.parse(response.body)).to include(
        {
          'id' => field.id,
          'label' => field.label,
          'field_type' => field.field_type,
          'required' => field.required,
          'field_document_template' => field.field_document_template,
          'procedure_template_id' => field.procedure_template_id,
          'created_at' => field.created_at.iso8601(3),
          'updated_at' => field.updated_at.iso8601(3)
        }
      )
    end
  end
end
