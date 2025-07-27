require 'rails_helper'

RSpec.describe PrinterCloud::FileSystem do
  describe '.move' do

    context 'when moving a document' do
      let(:destination_directory) { create(:directory)}

      subject { create(:document) }

      it 'moves the document to the new directory' do
      end
    end

    context 'when moving a directory' do
      subject { create(:directory) }

      let(:child_directory) { create(:directory, parent_directory: subject) }

      context 'when moving to a directory' do
        let(:destination_directory) { create(:directory)}

        it 'moves child directories' do
          path = PrinterCloud::Path.new(subject, directory_id: destination_directory.id)
          PrinterCloud::FileSystem.move(subject, path: path)

          expect(child_directory.department_id).to be(destination_directory.department_id)
        end
      end

      context 'when moving to a department' do
        let(:destination_department) { create(:department) }

        it 'moves child directories' do
          path = PrinterCloud::Path.new(subject, department_id: destination_department.id)
          PrinterCloud::FileSystem.move(subject, path: path)

          expect(child_directory.department_id).to be(destination_department.id)
        end
      end
    end
  end
end
