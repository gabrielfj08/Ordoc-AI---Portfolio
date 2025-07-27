class CreateDepartments < ActiveRecord::Migration[6.1]
  def change
    create_table :departments do |t|
      t.string :name, null:false
      t.belongs_to :organization, foreign_key: true

      t.timestamps
    end
  end
end
