class AddTrashedAtToDocuments < ActiveRecord::Migration[6.1]
  def change
    add_column :documents, :trashed_at, :datetime
  end
end
