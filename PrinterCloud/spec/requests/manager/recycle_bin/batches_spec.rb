require 'rails_helper'

RSpec.describe 'Batches', type: :request do
  let(:user) { create(:user) }
  let(:organization) { create(:organization) }
  let(:department) { create(:department, organization: organization) }
  let!(:recycle_bin) { create(:recycle_bin, organization: organization) }
  let(:directory) { create(:directory, department: department) }
  let(:another_directory) { create(:directory, department: department) }
  let(:document) { create(:document, directory: directory) }
  let(:another_document) { create(:document, directory: another_directory) }
  let!(:role) { create(:role, user: user, type: Roles::ORGANIZATION_MANAGER, organization: organization) }
  let(:authorization_headers) do
    { 'Authorization' => "Bearer #{user.token}" }
  end

  describe 'POST /manager/recycle_bin/:recycle_bin_id/untrash' do
    it 'untrashes all objects' do
      directory.trash! user
      another_directory.trash! user
      document.trash! user
      another_document.trash! user

      post "/manager/recycle_bin/#{recycle_bin.id}/untrash", headers: authorization_headers, params: {
        directory_ids: [directory.id, another_directory.id],
        document_ids: [document.id, another_document.id]
      }
      expect(response).to have_http_status :ok

      expect(directory.reload.trashed?).to be false
    end

    it 'untrashes all objects' do
      directory.trash! user
      another_directory.trash! user
      document.trash! user
      another_document.trash! user

      post "/manager/recycle_bin/#{recycle_bin.id}/untrash", headers: authorization_headers, params: {
        directory_ids: [directory.id, another_directory.id],
        document_ids: [document.id, another_document.id]
      }
      expect(response).to have_http_status :ok

      expect(another_directory.reload.trashed?).to be false
    end

    it 'untrashes all objects' do
      directory.trash! user
      another_directory.trash! user
      document.trash! user
      another_document.trash! user

      post "/manager/recycle_bin/#{recycle_bin.id}/untrash", headers: authorization_headers, params: {
        directory_ids: [directory.id, another_directory.id],
        document_ids: [document.id, another_document.id]
      }
      expect(response).to have_http_status :ok

      expect(document.reload.trashed?).to be false
    end

    it 'untrashes all objects' do
      directory.trash! user
      another_directory.trash! user
      document.trash! user
      another_document.trash! user

      post "/manager/recycle_bin/#{recycle_bin.id}/untrash", headers: authorization_headers, params: {
        directory_ids: [directory.id, another_directory.id],
        document_ids: [document.id, another_document.id]
      }
      expect(response).to have_http_status :ok

      expect(another_document.reload.trashed?).to be false
    end
  end
end
