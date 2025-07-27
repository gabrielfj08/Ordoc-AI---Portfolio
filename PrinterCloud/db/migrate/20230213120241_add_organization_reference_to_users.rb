class AddOrganizationReferenceToUsers < ActiveRecord::Migration[6.1]
  def change
    add_reference :users, :organization, foreign_key: true
    add_column :users, :username, :string
  end
end
