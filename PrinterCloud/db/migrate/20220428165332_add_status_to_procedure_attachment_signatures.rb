class AddStatusToProcedureAttachmentSignatures < ActiveRecord::Migration[6.1]
  def change
    add_column :procedure_attachment_signatures, :status, :integer, null: false,  default: 0
  end
end
