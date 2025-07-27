require 'rails_helper'

RSpec.describe PrinterCloud::Path do
  let(:path) { PrinterCloud::Path.new(record, options) }

  describe '.to_attributes' do
    subject { path.to_attributes }

    context 'when moving a directory' do
      let(:record) { create(:directory) }

      context 'when moving to another directory' do
        let(:options) { { directory_id: destination_directory.id } }
        let(:destination_directory) { create(:directory, department_id: department.id) }
        let(:department) { create(:department) }
        let(:expected_attributes) do
          {
            parent_directory_id: destination_directory.id,
            department_id: department.id
          }
        end

        it { is_expected.to eq(expected_attributes) }
      end

      context 'when moving to a department' do
        let(:options) { { department_id: department.id } }
        let(:department) { create(:department) }
        let(:expected_attributes) do
          {
            department_id: department.id,
            parent_directory_id: nil
          }
        end
          
        it { is_expected.to eq(expected_attributes) }
      end
    end
    
    describe '#destination' do
      subject { path.destination }

      context 'when moving a directory' do
        let(:record) { create(:directory) }

        context 'when moving to another directory' do
          let(:options) { { directory_id: destination_directory } }
          let(:destination_directory) { create(:directory) }

          it { is_expected.to eq(destination_directory) }
        end

        context 'when moving to a department' do
          let(:options) { { department_id: destination_department } }
          let(:destination_department) { create(:department) }

          it { is_expected.to eq(destination_department) }
        end
      end
    end
  end
end
