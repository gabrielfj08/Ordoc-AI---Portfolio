class AddIndexToRoles < ActiveRecord::Migration[6.1]
  def change
    add_index :roles, [:user_id, :organization_id, :department_id], unique: true
  end
end
