class AddCpfToUsers < ActiveRecord::Migration[6.1]
  def change
    change_table :users do |t|
      t.string :cpf, null: false, default: ''

      add_index :users, :cpf
    end
  end
end
