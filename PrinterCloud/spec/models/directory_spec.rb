require 'rails_helper'

RSpec.describe Directory, type: :model do
  describe 'validations' do
    subject { build(:directory) }

    context 'when all attributes are valid' do
      it { is_expected.to be_valid }
    end

    context 'without a name' do
      subject { build(:directory, name: nil) }

      it 'is not valid' do
        expect(subject).to_not be_valid
        expect(subject.errors[:name]).to include('não pode ficar em branco')
      end
    end

    context 'without a description' do
      subject { build(:directory, description: nil) }

      it 'is not valid' do
        expect(subject).to_not be_valid
        expect(subject.errors[:description]).to include('não pode ficar em branco')
      end
    end
  end

  describe '#move' do
    subject { create(:directory, department_id: another_department.id, parent_directory_id: parent_directory.id) }
    let(:another_department) { create(:department) }
    let(:parent_directory) { create(:directory) }

    context 'when moving to a department' do
      let(:destination_department) { create(:department) }

      it 'moves to the new department' do
        path = PrinterCloud::Path.new(subject, department_id: destination_department.id)

        subject.move(path)

        expect(subject.department).to eq(destination_department)
      end

      context 'when directory has a parent' do
        it 'removes parent association' do
          path = PrinterCloud::Path.new(subject, department_id: destination_department.id)

          subject.move(path)

          expect(subject.parent_directory).to be(nil)
        end
      end
    end

    context 'when moving to a directory' do
      let(:destination_directory) { create(:directory) }

      it 'moves to the new directory' do
        path = PrinterCloud::Path.new(subject, directory_id: destination_directory.id)

        subject.move(path)

        expect(subject.parent_directory).to eq(destination_directory)
      end

      context 'when moving to another department\'s directory' do
        it 'inherit parent\'s department' do
          path = PrinterCloud::Path.new(subject, directory_id: destination_directory.id)

          subject.move(path)

          expect(subject.department_id).to eq(destination_directory.department_id)
        end
      end
    end
  end

  describe '#is_sub_directory_of?' do
    subject { directory.is_sub_directory_of?(another_directory) }

    context 'when called with a subdirectory' do
      let(:directory) { create(:directory, parent_directory: another_directory) }
      let(:another_directory) { create(:directory) }

      it { is_expected.to be(true) }
    end

    context 'when called with a sibling directory' do
      let(:directory) { create(:directory) }
      let(:another_directory) { create(:directory) }

      it { is_expected.to be(false) }
    end
  end

  describe '#sub_directories_tree' do
    subject { directory.sub_directories_tree }

    let(:directory) { create(:directory) }
    let!(:child_directory) { create(:directory, parent_directory_id: directory.id) }
    let!(:grand_child_directory) { create(:directory, parent_directory_id: child_directory.id) }

    it { is_expected.to include(child_directory, grand_child_directory) }
  end

  describe '#child_directory?' do
    subject { directory.child_directory? }

    context 'when directory is child_directory' do
      let(:directory) { build(:directory, :child) }

      it { is_expected.to be(true) }
    end

    context 'when directory is not child_directory' do
      let(:directory) { build(:directory, parent_directory_id: nil) }

      it { is_expected.to be(false) }
    end
  end

  describe '#parent_directory_id' do
  end

  describe 'root' do
    it 'returns root directories' do
      root_diretory = create(:directory)
      create(:directory, parent_directory: root_diretory)
      expect(described_class.root).to contain_exactly(root_diretory)
    end
  end
end
