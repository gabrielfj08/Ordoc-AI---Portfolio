require 'rails_helper'

RSpec.describe User, type: :model do
  describe 'validations' do
    describe 'cpf' do
      subject { build(:user, cpf: cpf) }

      context 'when cpf is valid' do
        let(:cpf) { '00960677992' }
        it { is_expected.to be_valid }
      end

      context 'when cpf is invalid' do
        let(:cpf) { '00000000000' }
        it { is_expected.not_to be_valid }
      end
    end
  end
end
