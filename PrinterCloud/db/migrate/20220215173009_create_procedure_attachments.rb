class CreateProcedureAttachments < ActiveRecord::Migration[6.1]
  def change
    create_table :procedure_attachments do |t|
      t.string      :name,        null: false
      t.belongs_to  :procedure,   foreign_key: true
      t.timestamp   :deleted_at,  index: true

      t.timestamps
    end
  end
end
