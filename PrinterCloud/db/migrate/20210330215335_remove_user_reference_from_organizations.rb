class RemoveUserReferenceFromOrganizations < ActiveRecord::Migration[6.1]
  def change
    remove_reference :organizations, :user, index: true
    add_column :organizations, :contact_name, :string
    add_column :organizations, :contact_phone, :string
  end
end
