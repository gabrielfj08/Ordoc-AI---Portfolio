class CreateProcedureTemplate < ActiveRecord::Migration[6.1]
  def change
    create_table 'printer_flow.procedure_templates' do |t|
      t.string :name, index: true, null: false
      t.string :prn, index: true, null: false, unique: true
      t.integer :source, index: true, null: false
      t.integer :status, index: true, null: false
      t.references :organization
      t.references :parent_procedure_template,
                   index: { name: 'index_procedure_templates_on_parent_procedure_template_id' },
                   foreign_key: { to_table: 'printer_flow.procedure_templates' }
      t.references :group_requester, foreign_key: { to_table: 'printer_flow.requesters' }

      t.timestamps
    end
  end
end
