class CreateFieldDocumentTemplate < ActiveRecord::Migration[6.1]
  def change
    create_table 'printer_flow.field_document_templates' do |t|
      t.references :organization, index: { name: 'index_field_document_templates_on_organization_id' }
      t.references :document
      t.references :created_by, foreign_key: { to_table: 'users' }
      t.integer :status, index: true, null: false
      t.string :name, index: true, null: false
      t.string :s3_key, null: false

      t.timestamps
    end
  end
end
