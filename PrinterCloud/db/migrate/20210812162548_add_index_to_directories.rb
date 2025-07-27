class AddIndexToDirectories < ActiveRecord::Migration[6.1]
  def change
    add_index :directories, [:name, :department_id], unique: true
  end
end
