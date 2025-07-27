class CreateUserGroupAssignments < ActiveRecord::Migration[6.1]
  def change
    drop_table 'printer_cloud.user_groups_users'

    create_table 'printer_cloud.user_group_assignments' do |t|
      t.references :user_group, null: false, foreign_key: { to_table: 'printer_cloud.user_groups' }
      t.references :user, null: false, foreign_key: { to_table: 'users' }
      t.timestamps
    end
  end
end
