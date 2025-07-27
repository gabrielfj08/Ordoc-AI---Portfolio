class AddIndexToDirectoriesPrn < ActiveRecord::Migration[6.1]
  def change
    add_index :directories, :prn, unique: true
  end
end
