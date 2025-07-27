class AddDeletedAtToDirectories < ActiveRecord::Migration[6.1]
  def change
    add_column :directories, :deleted_at, :datetime
    add_index :directories, :deleted_at
  end
end
