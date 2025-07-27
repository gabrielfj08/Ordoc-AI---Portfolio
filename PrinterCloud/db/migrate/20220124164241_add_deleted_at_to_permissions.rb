class AddDeletedAtToPermissions < ActiveRecord::Migration[6.1]
  def change
    add_column :permissions, :deleted_at, :datetime
    add_index :permissions, :deleted_at
  end
end
