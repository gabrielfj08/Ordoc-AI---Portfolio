require 'rails_helper'

RSpec.describe Formatters do
  describe '.remove_non_numeric' do
    subject { Formatters.remove_non_numeric(input) }

    describe 'when input is cpf' do
      let(:input) { '114.047.029-97' }
      let(:expected_result) { '11404702997' }

      it { is_expected.to eq(expected_result) }
    end

    describe 'when input is phone' do
      let(:input) { '(41) 99620-4789' }
      let(:expected_result) { '41996204789' }

      it { is_expected.to eq(expected_result) }
    end
  end
end
