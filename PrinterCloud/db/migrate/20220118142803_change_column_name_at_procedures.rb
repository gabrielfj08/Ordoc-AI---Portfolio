class ChangeColumnNameAtProcedures < ActiveRecord::Migration[6.1]
  def change
    rename_column :procedures, :is_type, :template
    change_column :procedures, :status, :integer, :default => 0
  end
end
