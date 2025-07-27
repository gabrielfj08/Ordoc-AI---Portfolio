class DropProcedureViewers < ActiveRecord::Migration[6.1]
  def change
    drop_table :procedure_viewers
  end
end
