class AddTrashedToDocumentsAndDirectories < ActiveRecord::Migration[6.1]
  def change
    add_reference :directories, :recycle_bin, null: true
  end
end
