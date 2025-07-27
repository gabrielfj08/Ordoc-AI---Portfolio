class AddCnpjAndUserReferenceToOrganizations < ActiveRecord::Migration[6.1]
  def change
    change_table :organizations do |t|
      t.string :cnpj, null: false
      t.belongs_to :user
    end
  end
end
