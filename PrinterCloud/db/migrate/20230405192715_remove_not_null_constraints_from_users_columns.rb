class RemoveNotNullConstraintsFromUsersColumns < ActiveRecord::Migration[6.1]
  def change
    change_column_null :users, :cpf, true
    change_column_null :users, :date_of_birth, true
    change_column_null :users, :phone, true
  end
end
