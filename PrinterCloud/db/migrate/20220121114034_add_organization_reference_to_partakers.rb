class AddOrganizationReferenceToPartakers < ActiveRecord::Migration[6.1]
  def change
    add_reference :partakers, :organization, null: false, foreign_key: true
    remove_index :partkers, name: :index_partakers_on_cpf_cnpj
    remove_index :partkers, name: :index_partakers_on_email
    add_index :partakers, [:organization_id, :cpf_cnpj], unique: true
    add_index :partakers, [:organization_id, :email], unique: true
  end
end
