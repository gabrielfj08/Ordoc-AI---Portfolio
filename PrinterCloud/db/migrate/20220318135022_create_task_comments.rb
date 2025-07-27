class CreateTaskComments < ActiveRecord::Migration[6.1]
  def change
    create_table :task_comments do |t|
      t.text :body, null: false
      t.belongs_to :created_by, foreign_key: { to_table: :users }
      t.belongs_to :task, null: false

      t.timestamps
    end
  end
end
