class CreatePrinterFlowTaskFields < ActiveRecord::Migration[6.1]
  def change
    create_table 'printer_flow.task_fields' do |t|
      t.references :fieldable, polymorphic: true
      t.references :task_template, index: true

      t.integer :field_type, index: true, null: false
      t.string :label, index: true, null: false
      t.string :value, index: true
      t.text :array_values, array: true, default: [], index: true
      t.text :options, array: true, default: [], index: true

      t.timestamps
    end
  end
end
