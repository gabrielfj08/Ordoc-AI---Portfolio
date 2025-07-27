class AddAcceptedByToTasks < ActiveRecord::Migration[6.1]
  def change
    add_reference :tasks, :assignable, null: true, polymorphic: true
  end
end
