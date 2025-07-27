class AddUuidToTaskDocuments < ActiveRecord::Migration[6.1]
  def change
    add_column :task_documents, :uuid, :string, null: false, unique: true, default: ''

    change_column_default :task_documents, :uuid, from: nil, to: ''
  end
end
