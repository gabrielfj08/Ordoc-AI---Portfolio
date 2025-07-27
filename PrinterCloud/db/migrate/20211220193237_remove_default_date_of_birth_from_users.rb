class RemoveDefaultDateOfBirthFromUsers < ActiveRecord::Migration[6.1]
  def change
    change_column_default :users, :date_of_birth, nil
  end
end
