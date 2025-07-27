class AddDeletedAtToInboxes < ActiveRecord::Migration[6.1]
  def change
    add_column :inboxes, :deleted_at, :datetime
    add_index :inboxes, :deleted_at
  end
end
