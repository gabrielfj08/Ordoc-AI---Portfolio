class AddPrnToUsers < ActiveRecord::Migration[6.1]
  def change
    add_column :users, :prn, :string, default: '', index: true, null: false

    change_column_default :users, :prn, nil
  end
end
