class CreatePrinterFlowTaskTemplates < ActiveRecord::Migration[6.1]
  def change
    create_table 'printer_flow.task_templates' do |t|
      t.references :organization

      t.string :name, index: true, null: false
      t.integer :status, null: false, default: 0

      t.timestamps
    end
  end
end
