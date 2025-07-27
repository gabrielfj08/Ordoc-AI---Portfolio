class CreatePrinterFlowFields < ActiveRecord::Migration[6.1]
  def change
    create_table 'printer_flow.fields' do |t|
      t.references :procedure_template, foreign_key: { to_table: 'printer_flow.procedure_templates' },
                                        index: { name: 'index_fields_on_printer_flow_procedure_template_id' }
      t.string :label, index: true
      t.integer :field_type, index: true
      t.boolean :required, default: true

      t.timestamps
    end
  end
end
