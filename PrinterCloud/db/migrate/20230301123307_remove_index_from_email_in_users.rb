class RemoveIndexFromEmailInUsers < ActiveRecord::Migration[6.1]
  def change
    remove_index :users, %i[email organization_id]

    add_index :users, :email
  end
end
