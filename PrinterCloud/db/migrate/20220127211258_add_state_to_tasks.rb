class AddStateToTasks < ActiveRecord::Migration[6.1]
  def change
    add_column :tasks, :state, :integer, null: false, default: 0
  end
end
