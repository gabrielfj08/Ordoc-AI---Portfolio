require 'rails_helper'

RSpec.describe 'Flow::SignatureInfos', type: :request do
  let!(:task_attachment_signature) { create(:task_attachment_signature, task_attachment: task_attachment) }
  let(:task_attachment) { create(:task_attachments, task: task) }
  let(:task) { create(:task, procedure: procedure) }
  let(:procedure) { create(:procedure, department: department) }
  let(:department) { create(:department, organization: organization) }
  let(:organization) { create(:organization) }

  describe '/flow/signature_info/' do
    it 'returns that signature is registered on system' do
      get '/flow/signature_info/', params: { signature: task_attachment_signature.signature }

      expect(JSON.parse(response.body)).to include(
        "valid" => "true"
      )
    end
  end

  describe '/flow/signature_info/' do
    it 'returns that signature is not registered on system' do
      invalid_token = "eyJhbGciOLJIUzI1NiJ9.eyJwcm9jZsWR1cmVfYXR0YWNobWVudF9pZCI6MSwidXNlcl9pZCI6MX0.EAZDKN4D6-gcCML_h4Tio9lCe96hO3awuI9aqxiei5M"
      get '/flow/signature_info/', params: { signature: invalid_token }

      expect(JSON.parse(response.body)).to include(
        "valid" => "false"
      )
    end
  end
end
  