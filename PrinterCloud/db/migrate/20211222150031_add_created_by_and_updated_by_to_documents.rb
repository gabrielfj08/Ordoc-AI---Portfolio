class AddCreatedByAndUpdatedByToDocuments < ActiveRecord::Migration[6.1]
  def change
    add_reference :documents, :created_by, foreign_key: { to_table: :users }, null: true
    add_reference :documents, :updated_by, foreign_key: { to_table: :users }, null: true
  end
end
