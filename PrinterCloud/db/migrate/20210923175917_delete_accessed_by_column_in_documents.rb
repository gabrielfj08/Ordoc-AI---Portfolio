class DeleteAccessedByColumnInDocuments < ActiveRecord::Migration[6.1]
  def change
    remove_column :documents, :last_accessed_by_id
  end
end
