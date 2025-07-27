class AddIndexToDocumentsPrn < ActiveRecord::Migration[6.1]
  def change
    add_index :documents, :prn
  end
end
