class AddRegistrationToUsers < ActiveRecord::Migration[6.1]
  def change
    add_column :users, :registration_number, :string, index: true
  end
end
