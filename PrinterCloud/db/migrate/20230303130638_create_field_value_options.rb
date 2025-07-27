class CreateFieldValueOptions < ActiveRecord::Migration[6.1]
  def change
    create_table 'printer_flow.field_value_options' do |t|
      t.references :field, foreign_key: { to_table: 'printer_flow.fields' },
                           index: { name: 'index_field_value_options_on_printer_flow_procedure_template_id' }
      t.string :value, index: true

      t.timestamps
    end
  end
end
