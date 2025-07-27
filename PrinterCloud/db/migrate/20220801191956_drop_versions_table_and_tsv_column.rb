class DropVersionsTableAndTsvColumn < ActiveRecord::Migration[6.1]
  def change
    drop_table :versions
    remove_column :documents, :tsv
  end
end
