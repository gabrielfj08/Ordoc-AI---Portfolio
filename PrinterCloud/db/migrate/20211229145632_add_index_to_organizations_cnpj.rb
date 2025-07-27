class AddIndexToOrganizationsCnpj < ActiveRecord::Migration[6.1]
  def change
    add_index :organizations, :cnpj, unique: true
  end
end
