class AddSignatureToProcedureAttachmentSignatures < ActiveRecord::Migration[6.1]
  def change
    add_column :procedure_attachment_signatures, :signature, :string
  end
end
