class CreateProcedureTemplateAttachments < ActiveRecord::Migration[6.1]
  def change
    create_table :procedure_template_attachments do |t|
      t.string :name, null: false
      t.belongs_to :procedure_template, foreign_key: true

      t.timestamps
    end
  end
end
