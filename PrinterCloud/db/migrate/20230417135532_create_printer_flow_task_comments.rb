class CreatePrinterFlowTaskComments < ActiveRecord::Migration[6.1]
  def change
    create_table 'printer_flow.task_comments' do |t|
      t.string :comment
      t.references :task, foreign_key: { to_table: 'printer_flow.tasks' }
      t.references :created_by, foreign_key: { to_table: 'printer_flow.requesters' }

      t.timestamps
    end
  end
end
