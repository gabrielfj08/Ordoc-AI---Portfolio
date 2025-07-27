class AddPrnToOrganizationMembership < ActiveRecord::Migration[6.1]
  def change
    add_column :organization_memberships, :prn, :string, null: false, default: ''
    add_index :organization_memberships, :prn

    change_column_default :organization_memberships, :prn, nil
  end
end
