class AddSourceColumnToProcedureDocumentsAndTaskDocuments < ActiveRecord::Migration[6.1]
  def change
    add_column 'printer_flow.procedure_documents', :source, :integer, null: false, default: 0
    add_column 'printer_flow.procedure_documents', :key, :string, null: false, default: ''
    add_column 'printer_flow.task_documents', :source, :integer, null: false, default: 0
    add_column 'printer_flow.task_documents', :key, :string, null: false, default: ''

    change_column_default 'printer_flow.procedure_documents', :key, from: '', to: nil
    change_column_default 'printer_flow.task_documents', :key, from: '', to: nil
  end
end
