class CreateProcedurePartakers < ActiveRecord::Migration[6.1]
  def change
    create_table :procedure_partakers do |t|
      t.integer :type
      t.references :procedure, null: false, foreign_key: true
      t.references :partaker, null: false, foreign_key: true

      t.timestamps
    end
  end
end
