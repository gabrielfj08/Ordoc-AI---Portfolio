class CreateProcedureTemplateDocuments < ActiveRecord::Migration[6.1]
  def change
    create_table 'printer_flow.procedure_template_documents' do |t|
      t.references :document, foreign_key: { to_table: 'documents' }
      t.references :procedure_template, foreign_key: { to_table: 'printer_flow.procedure_templates' },
                                        index: { name: 'index_procedure_template_documents_on_procedure_template_id' }
      t.references :created_by, foreign_key: { to_table: 'users' },
                                index: { name: 'index_procedure_template_documents_on_created_by_id' }
      t.integer :status, index: true, null: false
      t.string :name, index: true, null: false
      t.string :s3_key, null: false

      t.timestamps
    end
  end
end
