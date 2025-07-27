class AddDeletedAtToRecentDocuments < ActiveRecord::Migration[6.1]
  def change
    add_column :recent_documents, :deleted_at, :datetime
    add_index :recent_documents, :deleted_at
  end
end
