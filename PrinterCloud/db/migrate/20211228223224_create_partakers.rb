class CreatePartakers < ActiveRecord::Migration[6.1]
  def change
    create_table :partakers do |t|
      t.string :name, null: false
      t.string :email, null: false
      t.string :cpf_cnpj, null: false
      t.string :notes
      t.integer :status

      t.timestamps
    end
    add_index :partakers, :cpf_cnpj, unique: true
  end
end
