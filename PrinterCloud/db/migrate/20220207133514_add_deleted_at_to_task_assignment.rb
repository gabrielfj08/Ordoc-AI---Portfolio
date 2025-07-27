class AddDeletedAtToTaskAssignment < ActiveRecord::Migration[6.1]
  def change
    add_column :task_assignments, :deleted_at, :datetime
    add_index :task_assignments, :deleted_at
  end
end
