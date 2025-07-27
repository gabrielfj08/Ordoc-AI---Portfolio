class AddPreviousParentPrnToDocumentsAndDirectories < ActiveRecord::Migration[6.1]
  def change
    add_column :documents, :previous_parent_prn, :string
    add_column :directories, :previous_parent_prn, :string
  end
end
