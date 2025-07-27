class AddNameIndexToDirectories < ActiveRecord::Migration[6.1]
  def change
    add_index :directories, :name
  end
end
