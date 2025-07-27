class CreatePrinterFlowTaskAttachments < ActiveRecord::Migration[6.1]
  def change
    create_table 'printer_flow.task_attachments' do |t|
      t.references :task, foreign_key: { to_table: 'printer_flow.tasks' }
      t.references :attachable, polymorphic: true

      t.timestamps
    end
  end
end
