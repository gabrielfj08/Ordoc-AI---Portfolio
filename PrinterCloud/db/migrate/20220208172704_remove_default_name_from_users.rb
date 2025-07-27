class RemoveDefaultNameFromUsers < ActiveRecord::Migration[6.1]
  def change
    change_column_default :users, :name, nil
  end
end
