require 'rails_helper'

RSpec.describe 'PrinterSign::Signature', type: :request do
  let(:organization) { create(:organization) }
  let(:user) { create(:printer_cloud_user, organization: organization) }
  let(:requester) { create(:internal_requester, organization: organization) }
  let(:group_requester) { create(:group_requester, organization: organization) }
  let(:procedure_template) do
    create(:printer_flow_procedure_template, organization: organization)
  end
  let(:procedure) do
    create(:printer_flow_procedure, organization: organization, status: 'running', procedure_template_id: procedure_template.id,
                                    payload: [], requester_id: requester.id, created_by_id: user.id,
                                    responsible_group_id: group_requester.id)
  end
  let(:procedure_document) do
    create(:procedure_document, organization: organization, procedure_id: procedure.id,
                                created_by_id: user.id)
  end
  let!(:signature) do
    create(:signature, requester_id: user.internal_requester.id, signable_id: procedure_document.id, status: 'signed',
                       signable_type: procedure_document.class.to_s, procedure_id: procedure.id, created_by_id: user.id)
  end
  let(:subdomain) do
    { 'Authorization' => "Bearer #{user.token}",
      'X-Api-Subdomain' => organization.subdomain }
  end

  describe 'GET /signatures?decoded_token=document_token' do
    it 'responds with status ok' do
      get "/signatures?document_token=#{JsonWebToken.encode({ procedure: procedure_document.id })}",
          headers: subdomain

      expect(response).to have_http_status(:ok)
    end

    it 'renders a JSON with all signatures' do
      get "/signatures?document_token=#{JsonWebToken.encode({ procedure: procedure_document.id })}",
          headers: subdomain

      expect(JSON.parse(response.body)).to include(
        'printer_sign/signatures' => [{
          'id' => signature.id,
          'signable_id' => signature.signable_id,
          'signable_type' => signature.signable_type,
          'status' => signature.status,
          'service' => signature.service,
          'requester_id' => signature.requester_id,
          'created_by_id' => signature.created_by_id,
          'procedure_id' => signature.procedure_id,
          'procedure' => {
            'id' => signature.procedure.id,
            'deadline' => signature.procedure.deadline.to_s,
            'priority' => signature.procedure.priority,
            'private' => signature.procedure.private,
            'prn' => signature.procedure.prn,
            'organization_id' => signature.procedure.organization_id,
            'process_number' => signature.procedure.process_number,
            'responsible_group_id' => signature.procedure.responsible_group_id,
            'requester_id' => signature.procedure.requester_id,
            'created_by_id' => signature.procedure.created_by_id,
            'procedure_template_name' => signature.procedure.procedure_template_name,
            'procedure_template_id' => signature.procedure.procedure_template_id,
            'source' => signature.procedure.source,
            'status' => signature.procedure.status,
            'schema' => signature.procedure.schema,
            'payload' => signature.procedure.payload,
            'created_at' => signature.procedure.created_at.iso8601(3),
            'updated_at' => signature.procedure.updated_at.iso8601(3)
          },
          'signable' => {
            'id' => signature.signable.id,
            'name' => signature.signable.name,
            'created_by_id' => signature.signable.created_by_id,
            'uuid' => signature.signable.uuid,
            's3_key' => signature.signable.s3_key,
            'status' => signature.signable.status,
            'procedure_id' => signature.signable.procedure_id,
            'document_id' => signature.signable.document_id,
            'document_url' => signature.signable.document_url,
            'signed_document_id' => signature.signable.signed_document_id,
            'created_at' => signature.signable.created_at.iso8601(3),
            'updated_at' => signature.signable.updated_at.iso8601(3)
          },
          'requester' => {
            'id' => signature.requester.id,
            'name' => signature.requester.name,
            'organization_id' => signature.requester.organization_id,
            'parent_group_id' => nil,
            'prn' => signature.requester.prn,
            'email' => signature.requester.email,
            'type' => signature.requester.type,
            'cpf_cnpj' => signature.requester.cpf_cnpj,
            'code' => signature.requester.code,
            'status' => signature.requester.status,
            'birth_date' => signature.requester.birth_date.to_s,
            'phone' => signature.requester.phone,
            'optional_email' => signature.requester.optional_email,
            'optional_phone' => signature.requester.optional_phone,
            'occupation' => signature.requester.occupation,
            'created_at' => signature.requester.created_at.iso8601(3),
            'updated_at' => signature.requester.updated_at.iso8601(3),
            'blocked' => signature.requester.blocked
          },
          'created_by' => {
            'avatar_url' => signature.created_by.avatar_url,
            'changed_password' => signature.created_by.changed_password,
            'cpf' => signature.created_by.cpf,
            'created_at' => signature.created_by.created_at.iso8601(3),
            'updated_at' => signature.created_by.updated_at.iso8601(3),
            'deleted_at' => nil,
            'date_of_birth' => signature.created_by.date_of_birth.strftime('%Y-%m-%d'),
            'email' => signature.created_by.email,
            'id' => signature.created_by.id,
            'name' => signature.created_by.name,
            'organization_id' => signature.created_by.organization_id,
            'phone' => signature.created_by.phone,
            'prn' => signature.created_by.prn,
            'status' => signature.created_by.status,
            'username' => signature.created_by.username,
            'registration_number' => nil
          },
          'token' => signature.token,
          'created_at' => signature.created_at.iso8601(3),
          'updated_at' => signature.updated_at.iso8601(3)
        }],
        'meta' => {
          'total' => 1
        }
      )
    end
  end
end
