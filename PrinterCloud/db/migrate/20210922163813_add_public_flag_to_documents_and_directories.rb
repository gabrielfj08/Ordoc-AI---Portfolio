class AddPublicFlagToDocumentsAndDirectories < ActiveRecord::Migration[6.1]
  def change
    add_column :documents, :public?, :binary, :default => true
    add_column :directories, :public?, :binary, :default => true
  end
end
