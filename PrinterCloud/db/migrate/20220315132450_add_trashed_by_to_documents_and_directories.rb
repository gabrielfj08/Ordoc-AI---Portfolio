class AddTrashedByToDocumentsAndDirectories < ActiveRecord::Migration[6.1]
  def change
    add_reference :documents, :trashed_by, foreign_key: { to_table: :users }, null: true
    add_reference :directories, :trashed_by, foreign_key: { to_table: :users }, null: true
  end
end
