class AddNameAndPhoneToUsers < ActiveRecord::Migration[6.1]
  def change
    change_table :users do |t|
      t.string :name, null: false, default: ""
      t.string :phone, null: false, default: ""
    end
  end
end
