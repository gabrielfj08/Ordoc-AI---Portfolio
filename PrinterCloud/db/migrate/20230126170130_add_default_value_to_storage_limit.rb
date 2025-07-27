class AddDefaultValueToStorageLimit < ActiveRecord::Migration[6.1]
  def up
    change_column :organizations, :storage_limit, :decimal, default: 0, null: false, precision: 8, scale: 2
  end

  def down
    change_column :organizations, :storage_limit, :decimal, precision: 8, scale: 2
  end
end
