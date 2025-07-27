class AddPrnToDirectories < ActiveRecord::Migration[6.1]
  def change
    add_column :directories, :prn, :string, null: false, default: ''

    change_column_default :directories, :prn, from: '', to: nil
  end
end
