class CreatePrinterFlowExternalProcedureReports < ActiveRecord::Migration[6.1]
  def change
    create_table 'printer_flow.external_procedure_reports' do |t|
      t.references :procedure, foreign_key: { to_table: 'printer_flow.procedures' }
      t.references :document, foreign_key: true
      t.integer :status, index: true

      t.timestamps
    end
  end
end
