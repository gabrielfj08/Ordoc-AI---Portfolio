class AddStatusToOrganizations < ActiveRecord::Migration[6.1]
  def change
    add_column :organizations, :status, :integer, default: 0, null: false

    add_index :organizations, :status
  end
end
