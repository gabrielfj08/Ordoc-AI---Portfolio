class CreatePrinterFlowTaskDocuments < ActiveRecord::Migration[6.1]
  def up
    execute 'CREATE SCHEMA IF NOT EXISTS printer_flow'

    create_table 'printer_flow.task_documents' do |t|
      t.references :created_by, foreign_key: { to_table: 'users' }
      t.references :document, foreign_key: { to_table: 'documents' }
      t.references :signed_document, foreign_key: { to_table: 'documents' }
      t.references :task, foreign_key: { to_table: 'printer_flow.tasks' }
      t.string :name, index: true, null: false
      t.string :s3_key, null: false
      t.integer :status, index: true, null: false, default: 0

      t.timestamps
    end
  end

  def down
    drop_table 'printer_flow.task_documents'
  end
end
