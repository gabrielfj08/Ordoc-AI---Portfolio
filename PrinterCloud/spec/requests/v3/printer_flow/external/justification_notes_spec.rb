require 'rails_helper'

RSpec.describe 'PrinterFlow::JustificationNote', type: :request do
  let!(:justification_note) { create(:justification_note, created_by: requester, justifiable: procedure) }
  let(:requester) { create(:external_requester) }
  let(:procedure) { create(:printer_flow_procedure) }

  let(:credentials) do
    { 'Authorization' => "Bearer #{requester.token}",
      'X-Api-Subdomain' => requester.organization.subdomain }
  end

  describe 'GET /v3/printer_flow/external/justification_notes' do
    let(:params) do
      { justifiable_type: 'procedure',
        justifiable_id: procedure.id }
    end

    it 'responds with status ok' do
      get '/v3/printer_flow/external/justification_notes', params: params, headers: credentials

      expect(response).to have_http_status(:ok)
    end

    it 'renders a JSON with all justification_notes' do
      get '/v3/printer_flow/external/justification_notes', params: params, headers: credentials

      expect(JSON.parse(response.body)).to include(
        'printer_flow/justification_notes' => [{
          'id' => justification_note.id,
          'action' => justification_note.action,
          'created_at' => justification_note.created_at.iso8601(3),
          'updated_at' => justification_note.updated_at.iso8601(3),
          'created_by_id' => justification_note.created_by_id,
          'created_by' => { 'id' => justification_note.created_by.id,
                            'name' => justification_note.created_by.name,
                            'organization_id' => justification_note.created_by.organization_id,
                            'parent_group_id' => nil,
                            'prn' => justification_note.created_by.prn,
                            'email' => justification_note.created_by.email,
                            'type' => justification_note.created_by.type,
                            'cpf_cnpj' => justification_note.created_by.cpf_cnpj,
                            'code' => justification_note.created_by.code,
                            'status' => justification_note.created_by.status,
                            'blocked' => justification_note.created_by.blocked,
                            'birth_date' => justification_note.created_by.birth_date.to_s,
                            'phone' => justification_note.created_by.phone,
                            'optional_email' => justification_note.created_by.optional_email,
                            'optional_phone' => justification_note.created_by.optional_phone,
                            'occupation' => justification_note.created_by.occupation,
                            'created_at' => justification_note.created_by.created_at.iso8601(3),
                            'updated_at' => justification_note.created_by.updated_at.iso8601(3) },
          'justifiable_id' => justification_note.justifiable_id,
          'justifiable_type' => justification_note.justifiable_type,
          'note' => justification_note.note
        }],
        'meta' => { 'total' => 1 }
      )
    end
  end
end
