class RenameNotesFromTasks < ActiveRecord::Migration[6.1]
  def change
    rename_column :tasks, :notes, :description
  end
end
