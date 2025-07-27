class CreateProcedurePdf < ActiveRecord::Migration[6.1]
  def change
    create_table :procedure_pdfs do |t|
      t.string      :name,        null: false
      t.belongs_to  :procedure,   foreign_key: true
      t.integer     :status,      null: false, default: 0

      t.timestamps
    end
  end
end
