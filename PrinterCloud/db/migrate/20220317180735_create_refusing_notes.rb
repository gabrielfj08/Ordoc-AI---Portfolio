class CreateRefusingNotes < ActiveRecord::Migration[6.1]
  def change
    create_table :refusing_notes do |t|
      t.text :body, null: false
      t.belongs_to :created_by, foreign_key: { to_table: :users }
      t.belongs_to :task, null: false

      t.timestamps
    end
  end
end
