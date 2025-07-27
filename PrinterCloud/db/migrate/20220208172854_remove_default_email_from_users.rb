class RemoveDefaultEmailFromUsers < ActiveRecord::Migration[6.1]
  def change
    change_column_default :users, :email, nil
  end
end
