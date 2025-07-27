class AddUserGroupToTaskAssignments < ActiveRecord::Migration[6.1]
  def change
    add_reference :task_assignments, :user_group
  end
end
