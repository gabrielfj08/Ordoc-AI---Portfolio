class AddLogoUrlToOrganization < ActiveRecord::Migration[6.1]
  def change
    add_column :organizations, :logo_url, :string, default: '', null: false
  end
end
