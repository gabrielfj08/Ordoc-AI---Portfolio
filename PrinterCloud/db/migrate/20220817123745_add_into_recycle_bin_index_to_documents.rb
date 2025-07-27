class AddIntoRecycleBinIndexToDocuments < ActiveRecord::Migration[6.1]
  def change
    add_index :documents, :into_recycle_bin
  end
end
