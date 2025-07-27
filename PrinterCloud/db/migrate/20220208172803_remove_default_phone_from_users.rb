class RemoveDefaultPhoneFromUsers < ActiveRecord::Migration[6.1]
  def change
    change_column_default :users, :phone, nil
  end
end
