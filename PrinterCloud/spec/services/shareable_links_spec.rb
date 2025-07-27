require 'rails_helper'

RSpec.describe Services::ShareableLink do
  describe '.create_shareable_link' do
    let(:document) { create(:document) }

    context 'when creating a permanent link' do
      # subject { Services::ShareableLink.new(document).create_shareable_link(params) }
      # let(:params) { { document_id: document.id } }

      # it { is_expected.to be_a_kind_of(String) }
    end

    # context 'when creating a temporary link' do
    #   subject { doc.create_shareable_link(opts) }
    #   let(:doc) { Services::ShareableLink.new(document) }
    #   let(:document) { create(:document) }
    #   let(:opts) { { document_id: document.id, expires_in: 120 } }

    #   it { is_expected.to be_a_kind_of(String) }
    # end
  end
end
