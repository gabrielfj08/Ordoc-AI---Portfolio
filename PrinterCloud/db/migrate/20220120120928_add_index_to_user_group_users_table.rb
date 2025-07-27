class AddIndexToUserGroupUsersTable < ActiveRecord::Migration[6.1]
  def change
    add_index :user_groups_users, [:user_id, :user_group_id], unique: true
    add_index :user_groups, [:name, :organization_id], unique: true
  end
end
