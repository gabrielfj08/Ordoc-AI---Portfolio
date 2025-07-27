class AddParentDirectoryToDirectory < ActiveRecord::Migration[6.1]
  def change
    add_reference :directories, :parent_directory, foreign_key: { to_table: :directories }, null: true
  end
end
