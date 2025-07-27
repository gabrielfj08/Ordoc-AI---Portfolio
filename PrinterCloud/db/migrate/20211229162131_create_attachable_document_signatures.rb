class CreateAttachableDocumentSignatures < ActiveRecord::Migration[6.1]
  def change
    create_table :attachable_document_signatures do |t|
      t.references :attachable_document, null: false, foreign_key: true
      t.string :signed_name
      t.string :signed_cpf
      t.timestamp :deleted_at

      t.timestamps
    end
  end
end
