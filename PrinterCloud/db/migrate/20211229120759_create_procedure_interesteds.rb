class CreateProcedureInteresteds < ActiveRecord::Migration[6.1]
  def change
    create_table :procedure_interesteds do |t|
      t.references :user, null: false, foreign_key: true
      t.references :procedure, null: false, foreign_key: true
      t.integer :interested_type

      t.timestamps
    end
  end
end
