class AddColumnsToPrinterFlowProcedure < ActiveRecord::Migration[6.1]
  def up
    add_column 'printer_flow.procedures', :procedure_template_name, :string, index: true
    add_column 'printer_flow.procedures', :schema, :json

    change_column 'printer_flow.procedures', :priority, :integer, default: 0
    change_column 'printer_flow.procedures', :private, :boolean, default: false

    add_reference 'printer_flow.procedures', :created_by, foreign_key: { to_table: :users }
    add_reference 'printer_flow.procedures', :procedure_template,
                  foreign_key: { to_table: 'printer_flow.procedure_templates' }
    add_reference 'printer_flow.procedures', :organization

    remove_reference 'printer_flow.procedures', :user
  end

  def down
    remove_column 'printer_flow.procedures', :procedure_template_name, :string, index: true
    remove_column 'printer_flow.procedures', :schema, :json

    change_column 'printer_flow.procedures', :priority, :integer, default: nil
    change_column 'printer_flow.procedures', :private, :boolean, default: nil

    remove_reference 'printer_flow.procedures', :created_by, foreign_key: { to_table: :users }
    remove_reference 'printer_flow.procedures', :procedure_template,
                     foreign_key: { to_table: 'printer_flow.procedure_templates' }
    remove_reference 'printer_flow.procedures', :organization

    add_reference 'printer_flow.procedures', :user
  end
end
