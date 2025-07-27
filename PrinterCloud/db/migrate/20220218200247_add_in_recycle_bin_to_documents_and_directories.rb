class AddInRecycleBinToDocumentsAndDirectories < ActiveRecord::Migration[6.1]
  def change
    add_column :documents, :into_recycle_bin, :boolean, null: false, default: false
    add_column :directories, :into_recycle_bin, :boolean, null: false, default: false
  end
end
