class AddProcedureReferenceToAttachments < ActiveRecord::Migration[6.1]
  def change
    add_reference :attachments, :procedure, index: true, foreign_key: true
  end
end
