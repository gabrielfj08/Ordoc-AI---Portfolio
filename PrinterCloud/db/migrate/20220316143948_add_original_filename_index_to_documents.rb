class AddOriginalFilenameIndexToDocuments < ActiveRecord::Migration[6.1]
  def change
    add_index :documents, :original_filename
  end
end
