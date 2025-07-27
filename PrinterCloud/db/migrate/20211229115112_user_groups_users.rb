class UserGroupsUsers < ActiveRecord::Migration[6.1]
  def change
    create_table :user_groups_users do |t|
      t.references :user
      t.references :user_group
      t.timestamps
    end
  end
end
