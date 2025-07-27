class AddDateOfBirthToUsers < ActiveRecord::Migration[6.1]
  def change
    change_table :users do |t|
      t.date :date_of_birth, null: false, default: '1900-01-01'
    end
  end
end
