class AddLocationDescriptionAndDocumentsToDirectoryUpload < ActiveRecord::Migration[6.1]
  def change
    add_column :directory_uploads, :description, :string
    add_column :directory_uploads, :location, :string
    add_column :directory_uploads, :documents, :jsonb, array: true, default:['{}']
  end
end
