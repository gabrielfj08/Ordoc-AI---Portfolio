class RemoveAssignableFromTasks < ActiveRecord::Migration[6.1]
  def change
    remove_reference :tasks, :assignable, polymorphic: true, index: true
  end
end
