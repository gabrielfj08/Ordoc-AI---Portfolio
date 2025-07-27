class CreateTaskAssignmentNotes < ActiveRecord::Migration[6.1]
  def change
    create_table :task_assignment_notes do |t|
      t.belongs_to :task_assignment, foreign_key: true
      t.string     :user_name
      t.string     :body, null: false

      t.timestamps
    end
  end
end
