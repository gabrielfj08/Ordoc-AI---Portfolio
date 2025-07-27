class CreateTaskVisits < ActiveRecord::Migration[6.1]
  def change
    create_table :task_visits do |t|
      t.references :user, null: false, foreign_key: true
      t.references :task, null: false, foreign_key: true

      t.timestamps
    end
  end
end
