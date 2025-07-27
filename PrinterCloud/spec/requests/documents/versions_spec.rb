# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Documents::Versions', type: :request do
  include ActionDispatch::TestProcess::FixtureFile

  let(:organization) { create(:organization) }
  let(:department) { create(:department, organization: organization) }
  let(:directory) { create(:directory, department: department) }
  let(:user) { create(:user, :admin) }
  let(:authorization_headers) do
    { 'Authorization' => "Bearer #{user.token}" }
  end

  describe 'GET documents/:id/versions' do
    it 'returns old version from documents' do
      head_document = create(:document, directory: directory)
      old_version = create(:document, head_document: head_document)
      get "/documents/#{head_document.id}/versions/", headers: authorization_headers
      expect(JSON.parse(response.body).first['id']).to eq(old_version.id)
      expect(JSON.parse(response.body).second['id']).to eq(head_document.id)
    end
  end

  describe 'DELETE documents/:id/versions' do
    context 'when is not a version' do
      it 'returns error' do
        document = create(:document, directory: directory)
        delete "/documents/#{document.id}/versions/", headers: authorization_headers
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end

    context 'when is not head a version' do
      it 'only destroy the version' do
        head_document = create(:document, directory: directory)
        old_document = create(:document, directory: directory, head_document: head_document,
                                         description: 'old version description')
        delete "/documents/#{old_document.id}/versions/", headers: authorization_headers
        expect { Document.kept.find(old_document.id) }.to raise_error(ActiveRecord::RecordNotFound)
      end
    end
  end
end
