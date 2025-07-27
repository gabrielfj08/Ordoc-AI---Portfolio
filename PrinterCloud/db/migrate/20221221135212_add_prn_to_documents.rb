class AddPrnToDocuments < ActiveRecord::Migration[6.1]
  def change
    add_column :documents, :prn, :string, null: false, default: ''

    change_column_default :documents, :prn, nil
  end
end
