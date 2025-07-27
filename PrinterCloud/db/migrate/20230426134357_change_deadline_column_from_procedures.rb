class ChangeDeadlineColumnFromProcedures < ActiveRecord::Migration[6.1]
  def change
    change_column 'printer_flow.procedures', :deadline, :datetime, index: true
  end
end
