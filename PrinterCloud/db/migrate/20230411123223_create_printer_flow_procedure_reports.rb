class CreatePrinterFlowProcedureReports < ActiveRecord::Migration[6.1]
  def change
    create_table 'printer_flow.procedure_reports' do |t|
      t.references :procedure, foreign_key: { to_table: 'printer_flow.procedures' }
      t.references :document, foreign_key: true
      t.references :created_by, foreign_key: { to_table: 'users' }
      t.integer :status, index: true

      t.timestamps
    end
  end
end
