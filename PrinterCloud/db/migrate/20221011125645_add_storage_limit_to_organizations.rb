class AddStorageLimitToOrganizations < ActiveRecord::Migration[6.1]
  def change
    add_column :organizations, :storage_limit, :decimal, precision: 8, scale: 2
  end
end
