class AddDeletedByToDirectories < ActiveRecord::Migration[6.1]
  def change
    add_reference :directories, :deleted_by, foreign_key: { to_table: :users }, null: true
  end
end
