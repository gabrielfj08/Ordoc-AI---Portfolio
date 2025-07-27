class CreatePrinterCloudUserGroups < ActiveRecord::Migration[6.1]
  def up
    execute 'CREATE SCHEMA IF NOT EXISTS printer_cloud'

    create_table 'printer_cloud.user_groups' do |t|
      t.string :name, null: false
      t.string :description
      t.integer :status, null: false
      t.belongs_to :organization

      t.timestamps
    end

    create_table 'printer_cloud.user_groups_users', id: false do |t|
      t.belongs_to :user, null: false
      t.references :user_group, null: false, foreign_key: { to_table: 'printer_cloud.user_groups' }, index: { name: 'index_printer_cloud_user_groups_users.user_group_id' }
    end

    add_index 'printer_cloud.user_groups_users', [:user_id, :user_group_id], unique: true, name: 'index_user_groups_users_on_user_id_and_user_group_id'
    add_index 'printer_cloud.user_groups', :name
    add_index 'printer_cloud.user_groups', :status
  end

  def down
    drop_table 'printer_cloud.user_groups_users'
    drop_table 'printer_cloud.user_groups'
    execute 'DROP SCHEMA printer_cloud'
  end
end
