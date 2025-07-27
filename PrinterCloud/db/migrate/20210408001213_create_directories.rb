class CreateDirectories < ActiveRecord::Migration[6.1]
  def change
    create_table :directories do |t|
      t.string :name, null: false
      t.belongs_to :department, foreign_key: true

      t.timestamps
    end
  end
end
