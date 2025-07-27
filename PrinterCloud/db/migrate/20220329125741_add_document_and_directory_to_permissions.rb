class AddDocumentAndDirectoryToPermissions < ActiveRecord::Migration[6.1]
  def change
    add_reference :permissions, :directory, index: true, foreign_key: true
    add_reference :permissions, :document, index: true, foreign_key: true
  end
end
