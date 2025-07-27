class RenameTypeColumnOnProcedurePartaker < ActiveRecord::Migration[6.1]
  def change
    rename_column :procedure_partakers, :type, :partaker_type
  end
end
