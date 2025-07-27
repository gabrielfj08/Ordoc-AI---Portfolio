class RenameAttachableDocumentsToAttachments < ActiveRecord::Migration[6.1]
  def change
    rename_table :attachable_documents,  :attachments
    drop_table :attachable_document_signatures
  end
end
