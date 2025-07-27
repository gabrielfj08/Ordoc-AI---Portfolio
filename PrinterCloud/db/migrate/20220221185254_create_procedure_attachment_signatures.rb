class CreateProcedureAttachmentSignatures < ActiveRecord::Migration[6.1]
  def change
    create_table :procedure_attachment_signatures do |t|
      t.belongs_to :user,                 foreign_key: true
      t.belongs_to :procedure_attachment, foreign_key: true, index: { name: :idx_procedure_attachment_signatures_on_procedure_attachment_id }

      t.timestamps
    end
  end
end
