class AddStatusToTaskAssignments < ActiveRecord::Migration[6.1]
  def change
    add_column :task_assignments, :status, :integer, null: false, default: 0
  end
end
