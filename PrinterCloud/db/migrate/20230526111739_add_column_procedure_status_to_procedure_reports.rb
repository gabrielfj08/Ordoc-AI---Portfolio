class AddColumnProcedureStatusToProcedureReports < ActiveRecord::Migration[6.1]
  def change
    add_column 'printer_flow.procedure_reports', :procedure_status, :string
  end
end
