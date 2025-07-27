class AddLastAccessedByIdColumnToDocuments < ActiveRecord::Migration[6.1]
  def change
    add_reference :documents, :last_accessed_by, foreign_key: { to_table: :users}, null: true
  end
end
