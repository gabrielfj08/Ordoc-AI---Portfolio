class DropOrganizationMemberships < ActiveRecord::Migration[6.1]
  def change
    drop_table :organization_memberships
  end
end
