class CreateProcedures < ActiveRecord::Migration[6.1]
  def change
    create_table :procedures do |t|
      t.string :name, null: false
      t.string :description, null: false
      t.string :internal_process_number, null: true
      t.string :document_number, null: true
      t.integer :visibility, defalt: 0, null: false
      t.integer :status, defalt: 0, null: false
      t.references :department, null: false, foreign_key: true
      t.timestamp :deleted_at
      t.bigint :parent_id, null: true

      t.timestamps
    end

    add_index :procedures, :parent_id, unique: false
  end
end
