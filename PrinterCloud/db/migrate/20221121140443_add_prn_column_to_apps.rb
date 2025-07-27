class AddPrnColumnToApps < ActiveRecord::Migration[6.1]
  def change
    add_column :apps, :prn, :string, null: false, default: ''
    add_index :apps, :prn

    change_column_default :apps, :prn, nil
  end
end
