class AddCnpjColumnToContactInformation < ActiveRecord::Migration[6.1]
  def change
    add_column :contact_informations, :cnpj, :string
  end
end
