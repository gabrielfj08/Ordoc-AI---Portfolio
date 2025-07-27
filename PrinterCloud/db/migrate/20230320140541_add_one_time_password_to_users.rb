class AddOneTimePasswordToUsers < ActiveRecord::Migration[6.1]
  def change
    add_column :users, :one_time_password, :string
    add_column :users, :one_time_password_sent_at, :datetime
  end
end
