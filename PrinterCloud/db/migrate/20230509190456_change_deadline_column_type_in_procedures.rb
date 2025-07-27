class ChangeDeadlineColumnTypeInProcedures < ActiveRecord::Migration[6.1]
  def change
    change_column 'printer_flow.procedures', :deadline, :date, index: true
  end
end
