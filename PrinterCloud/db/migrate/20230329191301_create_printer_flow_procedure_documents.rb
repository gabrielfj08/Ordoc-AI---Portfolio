class CreatePrinterFlowProcedureDocuments < ActiveRecord::Migration[6.1]
  def change
    create_table 'printer_flow.procedure_documents' do |t|
      t.references :created_by, foreign_key: { to_table: 'users' },
                                index: { name: 'index_procedure_dcuments_on_created_by_id' }
      t.references :document, foreign_key: { to_table: 'documents' }
      t.references :signed_document, foreign_key: { to_table: 'documents' }
      t.references :procedure, foreign_key: { to_table: 'printer_flow.procedures' }
      t.string :name, index: true, null: false
      t.string :s3_key, null: false
      t.string :uuid, null: false, index: true
      t.integer :status, index: true, null: false

      t.timestamps
    end
  end
end
