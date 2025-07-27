class AddHeadDocumentIdToDocument < ActiveRecord::Migration[6.1]
  def change
    add_reference :documents, :head_document, foreign_key: { to_table: :documents }, null: true
  end
end
