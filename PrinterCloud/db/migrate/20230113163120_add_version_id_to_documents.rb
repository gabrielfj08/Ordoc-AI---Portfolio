class AddVersionIdToDocuments < ActiveRecord::Migration[6.1]
  def change
    add_column :documents, :version_id, :integer
  end
end
