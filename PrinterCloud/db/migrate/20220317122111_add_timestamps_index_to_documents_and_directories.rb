class AddTimestampsIndexToDocumentsAndDirectories < ActiveRecord::Migration[6.1]
  def change
    add_index :documents, :created_at
    add_index :documents, :updated_at
    add_index :directories, :created_at
    add_index :directories, :updated_at
  end
end
