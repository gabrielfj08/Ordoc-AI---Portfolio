class RemoveDefaultCpfFromUsers < ActiveRecord::Migration[6.1]
  def change
    change_column_default :users, :cpf, nil
  end
end
