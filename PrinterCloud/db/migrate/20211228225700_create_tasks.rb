class CreateTasks < ActiveRecord::Migration[6.1]
  def change
    create_table :tasks do |t|
      t.timestamp :deleted_at
      t.references :procedure, null: false, foreign_key: true
      t.string :name
      t.string :notes

      t.timestamps
    end
  end
end
