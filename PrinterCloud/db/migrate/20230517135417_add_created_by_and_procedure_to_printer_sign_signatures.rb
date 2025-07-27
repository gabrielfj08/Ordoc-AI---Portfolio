class AddCreatedByAndProcedureToPrinterSignSignatures < ActiveRecord::Migration[6.1]
  def change
    add_reference 'printer_sign.signatures', :created_by, foreign_key: { to_table: :users }
    add_reference 'printer_sign.signatures', :procedure, foreign_key: { to_table: 'printer_flow.procedures' }
  end
end
