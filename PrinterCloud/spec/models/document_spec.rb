# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Document, type: :model do
  describe 'validations' do
    context 'when all attributes are valid' do
      it { expect(build(:document)).to be_valid }
    end
  end

  describe 'default_scope' do
    it 'returns all current documents' do
      new_version = create(:document)
      create(:document, head_document_id: new_version.id)
      expect(described_class.all).to contain_exactly(new_version)
    end
  end

  describe 'with_old_version' do
    it 'returns all current documents' do
      new_version = create(:document)
      old_version = create(:document, head_document_id: new_version.id)
      expect(described_class.with_old_versions).to contain_exactly(old_version, new_version)
    end
  end

  describe 'move_to_recycle_bin' do
    let(:organization) { create(:organization) }
    let(:department) { create(:department, organization: organization) }
    let(:directory) { create(:directory, department: department) }
    let(:recycle_bin) { create(:recycle_bin, organization: organization) }

    context 'when already in recycle bin' do
      it { expect(create(:document, recycle_bin: recycle_bin).destroy).to be_truthy }
    end
    context 'when exists recycle bin from organization' do
      it { expect(create(:document, directory: directory).destroy).to be_truthy }
    end
  end

  describe '#destroy' do
    it 'moves document to recycle bin' do
    end

    it 'updates document deleted by' do
    end

    it 'deletes document shareable link' do
    end
  end
end
