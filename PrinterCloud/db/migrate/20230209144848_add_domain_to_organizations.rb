class AddDomainToOrganizations < ActiveRecord::Migration[6.1]
  def change
    add_column :organizations, :subdomain, :string, index: true
  end
end
