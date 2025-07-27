class DropGroupAssignments < ActiveRecord::Migration[6.1]
  def change
    drop_table :group_assignments
  end
end
