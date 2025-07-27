class RenameRolesColumnNameToType < ActiveRecord::Migration[6.1]
  def change
    rename_column :roles, :name, :type
    add_index :roles, :type
  end
end
