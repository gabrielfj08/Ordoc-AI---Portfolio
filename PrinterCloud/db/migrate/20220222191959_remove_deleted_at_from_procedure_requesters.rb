class RemoveDeletedAtFromProcedureRequesters < ActiveRecord::Migration[6.1]
  def change
    remove_column :procedure_requesters, :deleted_at, :datetime
  end
end
