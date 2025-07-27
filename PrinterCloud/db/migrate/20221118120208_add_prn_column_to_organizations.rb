class AddPrnColumnToOrganizations < ActiveRecord::Migration[6.1]
  def change
    add_column :organizations, :prn, :string, null: false, default: ''
    add_index :organizations, :prn

    change_column_default :organizations, :prn, nil
  end
end
