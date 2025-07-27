class AddUserDocumentsIndexToRecentDocuments < ActiveRecord::Migration[6.1]
  def change
    add_index :recent_documents, [:document_id, :user_id] , unique: true
  end
end
