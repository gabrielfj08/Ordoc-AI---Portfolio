class AddArchivedAtToProcedures < ActiveRecord::Migration[6.1]
  def change
    add_column  :procedures, :archived_at, :datetime
    add_index   :procedures, :archived_at
  end
end
