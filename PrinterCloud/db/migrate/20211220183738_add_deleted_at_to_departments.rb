class AddDeletedAtToDepartments < ActiveRecord::Migration[6.1]
  def change
    add_column :departments, :deleted_at, :datetime
    add_index :departments, :deleted_at 
  end
end
