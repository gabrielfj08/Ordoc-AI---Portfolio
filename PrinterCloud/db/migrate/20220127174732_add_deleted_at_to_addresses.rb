class AddDeletedAtToAddresses < ActiveRecord::Migration[6.1]
  def change
    add_column :addresses, :deleted_at, :datetime
    add_index :addresses, :deleted_at
  end
end
