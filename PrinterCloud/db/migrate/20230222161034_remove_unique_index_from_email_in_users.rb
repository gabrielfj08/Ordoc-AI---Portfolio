class RemoveUniqueIndexFromEmailInUsers < ActiveRecord::Migration[6.1]
  def change
    remove_index :users, :email
    add_index :users, %i[email organization_id], unique: true

    change_column_default :users, :changed_password, false
  end
end
