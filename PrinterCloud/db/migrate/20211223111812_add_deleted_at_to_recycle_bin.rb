class AddDeletedAtToRecycleBin < ActiveRecord::Migration[6.1]
  def change
    add_column :recycle_bins, :deleted_at, :datetime
    add_index :recycle_bins, :deleted_at 
  end
end
