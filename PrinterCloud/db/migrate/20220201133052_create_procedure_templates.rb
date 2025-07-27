class CreateProcedureTemplates < ActiveRecord::Migration[6.1]
  def change
    create_table :procedure_templates do |t|
      t.string      :name,        null: false
      t.string      :description, null: false
      t.integer     :status,      null: false, default: 0
      t.belongs_to  :department,  foreign_key: true
      t.timestamp   :deleted_at,  index: true

      t.timestamps
    end
  end
end
