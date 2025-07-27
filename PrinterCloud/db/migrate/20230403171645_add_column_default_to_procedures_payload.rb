class AddColumnDefaultToProceduresPayload < ActiveRecord::Migration[6.1]
  def change
    change_column_default 'printer_flow.procedures', :payload, from: nil, to: []
    change_column_default 'printer_flow.procedures', :schema, from: nil, to: []
  end
end
