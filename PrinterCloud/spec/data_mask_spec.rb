require 'rails_helper'

RSpec.describe DataMask do
  describe '#mask_email' do
    subject { DataMask.mask_email(input) }

    describe 'when input is a correct email' do
      let(:input) { 'mariana.trancoso@printerdobrasil.com.br' }
      let(:expected_result) { 'm*************so@printerdobrasil.com.br' }

      it { is_expected.to eq(expected_result) }
    end
  end

  describe '#mask_phone' do
    subject { DataMask.mask_phone(input) }

    describe 'when input is a correct phone' do
      let(:input) { '41992199033' }
      let(:expected_result) { '(41)*****-9033' }

      it { is_expected.to eq(expected_result) }
    end
  end

  describe '#mask_cpf' do
    subject { DataMask.mask_cpf(input) }

    describe 'when input is a correct cpf' do
      let(:input) { '08986183986' }
      let(:expected_result) { '089******86' }

      it { is_expected.to eq(expected_result) }
    end
  end
end
