class CreateHistories < ActiveRecord::Migration[6.1]
  def change
    create_table :histories do |t|
      t.references :trackable, polymorphic: true, null: false
      t.integer :action
      t.text :attributes_before
      t.text :attributes_after
      t.references :user

      t.timestamps
    end
  end
end
