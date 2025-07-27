class CreateAttachableDocuments < ActiveRecord::Migration[6.1]
  def change
    create_table :attachable_documents do |t|
      t.string :name
      t.string :description
      t.timestamp :deleted_at
      t.references :attachable, polymorphic: true

      t.timestamps
    end
  end
end
