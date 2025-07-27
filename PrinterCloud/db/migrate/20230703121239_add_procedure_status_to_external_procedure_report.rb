class AddProcedureStatusToExternalProcedureReport < ActiveRecord::Migration[6.1]
  def change
    add_column :external_procedure_reports, :procedure_status, :string, null: false, default: ""

    change_column_default :external_procedure_reports, :procedure_status, nil
  end
end
