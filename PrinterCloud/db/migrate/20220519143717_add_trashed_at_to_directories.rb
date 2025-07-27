class AddTrashedAtToDirectories < ActiveRecord::Migration[6.1]
  def change
    add_column :directories, :trashed_at, :datetime
  end
end
