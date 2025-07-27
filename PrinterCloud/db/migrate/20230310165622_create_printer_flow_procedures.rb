class CreatePrinterFlowProcedures < ActiveRecord::Migration[6.1]
  def change
    create_table 'printer_flow.procedures' do |t|
      t.integer :status, index: true
      t.integer :source, index: true, default: 0
      t.integer :priority, index: true
      t.date :deadline, index: true
      t.string :prn, index: true
      t.string :process_number, index: true
      t.boolean :private, index: true
      t.json :payload
      t.references :user, index: true, optional: true
      t.references :responsible_group, foreign_key: { to_table: 'printer_flow.requesters' }
      t.references :requester, foreign_key: { to_table: 'printer_flow.requesters' }

      t.timestamps
    end
  end
end
