class AddDeletedAtToProcedureRequesters < ActiveRecord::Migration[6.1]
  def change
    add_column :procedure_requesters, :deleted_at, :datetime
    add_index  :procedure_requesters, :deleted_at
  end
end
