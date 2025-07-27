class CreateUserGroups < ActiveRecord::Migration[6.1]
  def change
    create_table :user_groups do |t|
      t.string :name
      t.string :notes
      t.integer :status
      t.references :organization, null: false, foreign_key: true
      t.timestamp :deleted_at

      t.timestamps
    end
  end
end
