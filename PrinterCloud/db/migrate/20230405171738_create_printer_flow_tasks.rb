class CreatePrinterFlowTasks < ActiveRecord::Migration[6.1]
  def change
    create_table 'printer_flow.tasks' do |t|
      t.integer :status, index: true
      t.integer :priority, index: true, default: 0
      t.date :deadline, index: true
      t.string :prn, index: true
      t.string :description
      t.string :name, index: true, null: false
      t.references :created_by, foreign_key: { to_table: 'users' },
                                index: { name: 'index_printer_flow_tasks_on_created_by_id' }
      t.references :assignee, foreign_key: { to_table: 'printer_flow.requesters' }
      t.references :procedure, foreign_key: { to_table: 'printer_flow.procedures' }
      t.references :group_assignee, foreign_key: { to_table: 'printer_flow.requesters' }

      t.timestamps
    end
  end
end
