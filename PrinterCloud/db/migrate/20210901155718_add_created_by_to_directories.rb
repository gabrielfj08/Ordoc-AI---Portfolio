class AddCreatedByToDirectories < ActiveRecord::Migration[6.1]
  def change
    add_reference :directories, :created_by, foreign_key: { to_table: :users }, null: true
    add_reference :directories, :updated_by, foreign_key: { to_table: :users }, null: true
  end
end
