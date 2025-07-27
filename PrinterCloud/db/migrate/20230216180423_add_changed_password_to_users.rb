class AddChangedPasswordToUsers < ActiveRecord::Migration[6.1]
  def change
    add_column :users, :changed_password, :boolean, default: true
  end
end
