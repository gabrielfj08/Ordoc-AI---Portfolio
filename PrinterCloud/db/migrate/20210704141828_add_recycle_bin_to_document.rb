class AddRecycleBinToDocument < ActiveRecord::Migration[6.1]
  def change
    add_reference :documents, :recycle_bin, null: true, foreign_key: true
  end
end
