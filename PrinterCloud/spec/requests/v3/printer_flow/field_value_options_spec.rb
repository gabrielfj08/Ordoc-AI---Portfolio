require 'rails_helper'

RSpec.describe 'PrinterFlow::FieldValueOption', type: :request do
  let!(:select_field) { field.field_value_options.create!(value: 'male') }
  let(:user) { create(:printer_cloud_user, :with_policies) }
  let(:procedure_template) { create(:printer_flow_procedure_template, organization: user.organization) }
  let(:field) { create(:field, procedure_template_id: procedure_template.id, field_type: 'select_field') }

  let(:credentials) do
    { 'Authorization' => "Bearer #{user.token}",
      'X-Api-Subdomain' => user.organization.subdomain }
  end

  describe 'GET /v3/printer_flow/fields/:field_id/field_value_options' do
    it 'responds with status ok' do
      get "/v3/printer_flow/fields/#{field.id}/field_value_options", headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'renders a JSON with all field value options' do
      get "/v3/printer_flow/fields/#{field.id}/field_value_options", headers: credentials

      expect(JSON.parse(response.body)).to include(
        'printer_flow/field_value_options' => [{
          'id' => select_field.id,
          'field_id' => select_field.field_id,
          'value' => select_field.value,
          'created_at' => select_field.created_at.iso8601(3),
          'updated_at' => select_field.updated_at.iso8601(3)
        }],
        'meta' => {
          'total' => 1

        }
      )
    end
  end

  describe 'GET /v3/printer_flow/fields/:field_id/field_value_options/:id' do
    it 'responds with status ok' do
      get "/v3/printer_flow/fields/#{field.id}/field_value_options/#{select_field.id}", headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'renders a JSON with the field value option' do
      get "/v3/printer_flow/fields/#{field.id}/field_value_options/#{select_field.id}", headers: credentials

      expect(JSON.parse(response.body)).to include(
        {
          'id' => select_field.id,
          'field_id' => select_field.field_id,
          'value' => select_field.value,
          'created_at' => select_field.created_at.iso8601(3),
          'updated_at' => select_field.updated_at.iso8601(3)
        }
      )
    end
  end

  describe 'POST /v3/printer_flow/fields/:field_id/field_value_options' do
    let(:create_params) do
      { field_value_option: { value: 'Solteiro' } }
    end

    it 'responds with status ok' do
      post "/v3/printer_flow/fields/#{field.id}/field_value_options", params: create_params,
                                                                      headers: credentials

      expect(response).to have_http_status(:created)
    end

    it 'renders a JSON with created field value option' do
      post "/v3/printer_flow/fields/#{field.id}/field_value_options", params: create_params,
                                                                      headers: credentials

      field_value_option_id = JSON.parse(response.body)['id']
      field_value_option = PrinterFlow::FieldValueOption.find(field_value_option_id)

      expect(JSON.parse(response.body)).to include(
        {
          'id' => field_value_option.id,
          'field_id' => field_value_option.field_id,
          'value' => field_value_option.value,
          'created_at' => field_value_option.created_at.iso8601(3),
          'updated_at' => field_value_option.updated_at.iso8601(3)
        }
      )
    end
  end

  describe 'PUT /v3/printer_flow/fields/:field_id/field_value_options/:id' do
    let(:update_params) do
      { field_value_option: { value: 'Feliz' } }
    end

    it 'responds with status ok' do
      put "/v3/printer_flow/fields/#{field.id}/field_value_options/#{select_field.id}", params: update_params,
                                                                                        headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'renders a JSON with updated field value option' do
      put "/v3/printer_flow/fields/#{field.id}/field_value_options/#{select_field.id}", params: update_params,
                                                                                        headers: credentials

      select_field.reload

      expect(JSON.parse(response.body)).to include(
        {
          'id' => select_field.id,
          'field_id' => select_field.field_id,
          'value' => select_field.value,
          'created_at' => select_field.created_at.iso8601(3),
          'updated_at' => select_field.updated_at.iso8601(3)
        }
      )
    end
  end

  describe 'DELETE /v3/printer_flow/fields/:field_id/field_value_options/:id' do
    it 'responds with status ok' do
      delete "/v3/printer_flow/fields/#{field.id}/field_value_options/#{select_field.id}", headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'renders a JSON with destroyed field value option' do
      delete "/v3/printer_flow/fields/#{field.id}/field_value_options/#{select_field.id}", headers: credentials

      expect(JSON.parse(response.body)).to include(
        {
          'id' => select_field.id,
          'field_id' => select_field.field_id,
          'value' => select_field.value,
          'created_at' => select_field.created_at.iso8601(3),
          'updated_at' => select_field.updated_at.iso8601(3)
        }
      )
    end
  end
end
