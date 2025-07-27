class AddDeletedAtToProcedureViewers < ActiveRecord::Migration[6.1]
  def change
    add_column :procedure_viewers, :deleted_at, :datetime
    add_index  :procedure_viewers, :deleted_at
  end
end
