class CreateRequesterInfos < ActiveRecord::Migration[6.1]
  def up
    execute 'CREATE SCHEMA IF NOT EXISTS printer_flow'

    create_table 'printer_flow.requester_infos' do |t|
      t.references :requester, foreign_key: { to_table: 'printer_flow.requesters' }
      t.references :created_by, foreign_key: { to_table: 'users' }

      t.integer :procedures_count, default: 0, null: false
      t.integer :status, null: false, default: 0

      t.timestamps
    end
  end

  def down
    drop_table 'printer_flow.requester_infos'
  end
end
